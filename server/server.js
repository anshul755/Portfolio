const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Pinecone, ServerlessSpec } = require('@pinecone-database/pinecone');
const pdf = require('pdf-parse');
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8080;
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'portfolio-rag-768';

const GENERATION_MODEL = 'gemini-2.5-flash';
const EMBEDDING_MODEL = 'text-embedding-004';
const EMBEDDING_DIMENSION = 768;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

if (!GEMINI_API_KEY) console.warn('Warning: GEMINI_API_KEY is not set.');
if (!PINECONE_API_KEY) console.warn('Warning: PINECONE_API_KEY is not set.');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });

app.use(cors());
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: '/tmp/' });

async function extractText(filePath, mimeType) {
    const buffer = await fs.readFile(filePath);
    if (mimeType === 'application/pdf') {
        const data = await pdf(buffer);
        return data.text || '';
    }
    return buffer.toString('utf-8');
}

function chunkText(text, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start += chunkSize - overlap;
    }
    return chunks;
}

async function ensurePineconeIndex() {
    try {
        console.log(`Checking Pinecone indexes for "${PINECONE_INDEX}"...`);
        const listResp = await pinecone.listIndexes();
        const indexNames = Array.isArray(listResp)
            ? listResp.map(idx => idx.name)
            : (listResp.indexes || []).map(idx => idx.name);
        const exists = indexNames.includes(PINECONE_INDEX);
        if (exists) {
            console.log(`Index "${PINECONE_INDEX}" already exists.`);
            return;
        }
        console.log(`Index "${PINECONE_INDEX}" not found. Creating with dimension ${EMBEDDING_DIMENSION}...`);
        await pinecone.createIndex({
            name: PINECONE_INDEX,
            dimension: EMBEDDING_DIMENSION,
            metric: 'cosine',
            spec: new ServerlessSpec({
                cloud: "aws",
                region: "us-east-1",
            }),
        });
        console.log('Index creation requested. Waiting 30s for index readiness...');
        await new Promise(r => setTimeout(r, 30000));
        console.log('Done waiting - index should be ready.');
    } catch (err) {
        console.error('Error while ensuring Pinecone index:', err);
        throw err;
    }
}

async function embedTexts(texts) {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const embeddings = [];
    if (typeof model.batchEmbedContents === 'function') {
        try {
            const batched = await model.batchEmbedContents({
                requests: texts.map(t => ({ content: { parts: [{ text: t }] }, taskType: "RETRIEVAL_DOCUMENT" }))
            });
            if (batched?.embeddings && Array.isArray(batched.embeddings)) {
                return batched.embeddings.map(e => e.values);
            }
        } catch (err) {
            console.warn('batchEmbedContents failed or unsupported; falling back to per-item embed:', err);
        }
    }
    for (const t of texts) {
        const res = await model.embedContent({
            content: { parts: [{ text: t }] },
            taskType: "RETRIEVAL_DOCUMENT"
        });
        const vec = res?.embedding?.values || res?.embeddings?.[0]?.values || res?.data?.[0]?.embedding;
        if (!vec) throw new Error('Failed to extract embedding vector');
        embeddings.push(vec);
    }
    return embeddings;
}

(async () => {
    try { await ensurePineconeIndex(); } catch (err) { console.error('Fatal: could not ensure Pinecone index.'); }
})();

app.get('/health', (req, res) => res.json({ status: 'ok', port: PORT, index: PINECONE_INDEX }));

app.post('/ingest', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        console.log(`Ingesting file: ${file.originalname}`);
        const text = await extractText(file.path, file.mimetype);
        await fs.unlink(file.path).catch(() => { });
        const chunks = chunkText(text, 1000, 200);

        const index = pinecone.index(PINECONE_INDEX);
        const batchSize = 20;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const slice = chunks.slice(i, i + batchSize);
            const vectors = await embedTexts(slice);
            const upserts = vectors.map((vec, idx) => ({
                id: `${Date.now()}-${i + idx}`,
                values: vec,
                metadata: { text: slice[idx] }
            }));
            await index.upsert({ vectors: upserts });
        }
        return res.json({ status: 'ingested', chunks: chunks.length });
    } catch (err) {
        console.error('Ingest error:', err);
        return res.status(500).json({ error: err.message });
    }
});

app.post('/query', async (req, res) => {
    try {
        const question = req.body?.question;
        if (!question) return res.status(400).json({ error: 'Missing question in request body' });

        const embedModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
        const embedResp = await embedModel.embedContent({
            content: { parts: [{ text: question }] },
            taskType: "RETRIEVAL_QUERY"
        });
        const qVec = embedResp?.embedding?.values || embedResp?.embeddings?.[0]?.values;
        if (!qVec) throw new Error('Failed to obtain query embedding');

        const index = pinecone.index(PINECONE_INDEX);
        const queryResp = await index.query({
            topK: 5,
            vector: qVec,
            includeMetadata: true
        });

        const hits = (queryResp.matches || []).map(m => m.metadata?.text || '').filter(Boolean);
        const contextText = hits.join('\n\n---\n\n');
        const chatModel = genAI.getGenerativeModel({ model: GENERATION_MODEL });

        const prompt = `You are Anshul Patel's AI Portfolio Assistant. 
        
Your role is to answer questions about Anshul's skills, projects (PageRank, LuxeLodge, etc.), education, and experience based ONLY on the provided context.

CONTEXT:
${contextText}

QUESTION:
${question}

INSTRUCTIONS:
1. If the user greets you (e.g., "Hi", "Hello") or asks who you are, introduce yourself politely using the context (if available) or simply say: "Hello! I am Anshul's AI Assistant. How can I help you today?"
2. For specific questions about Anshul, use the context provided.
3. If the answer is NOT in the context, say: "I'm sorry, I don't have that information about Anshul yet." do not make up facts.
4. Keep answers concise and professional.`;

        const completion = await chatModel.generateContent(prompt);
        const answer = completion?.response?.text() || "Sorry, I couldn't generate a response.";

        return res.json({ answer, sources: hits.slice(0, 5) });
    } catch (err) {
        console.error('Query error:', err);
        return res.status(500).json({ error: err.message });
    }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: err.message });
});

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`RAG server listening on port ${port} (index=${PINECONE_INDEX})`);
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            const newPort = port + 1;
            console.warn(`Port ${port} in use, trying ${newPort}...`);
            startServer(newPort);
        } else {
            console.error('Server error:', err);
        }
    });
}

module.exports = app;

if (require.main === module) {
    startServer(PORT);
}