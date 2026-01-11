const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Pinecone } = require("@pinecone-database/pinecone");
require("dotenv").config();

const CONFIG = {
    pineconeIndex: process.env.PINECONE_INDEX || "portfolio-rag-768",
    modelName: "text-embedding-004",
    embeddingDim: 768,
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const rawData = [
    {
        id: "greeting-identity",
        category: "General",
        title: "Greeting & AI Identity",
        text: `If the user says 'Hello', 'Hi', 'Hey', or asks 'Who are you?', respond with:
"Hello! I am Anshul's AI Portfolio Assistant. I can tell you about his projects (like PageRank & LuxeLodge), his skills in Java & Python, or his internship experiences. What would you like to know?"
I am an AI interface for Anshul Patel's portfolio.`,
        topics: ["hello", "hi", "hey", "greetings", "who are you", "identity"]
    },
    {
        id: "bio-contact",
        category: "Personal",
        title: "Contact & Bio",
        text: `Name: Anshul Patel.
Role: Full Stack Developer & AI Enthusiast.
Location: Ahmedabad, Gujarat, India.
Contact: anshulpatel2023@gmail.com | +91 63531 43083.
Links: LinkedIn, GitHub (anshul755).
Summary: A passionate software engineer building scalable apps, currently pursuing B.Tech in CSE.`,
        topics: ["contact", "email", "location", "bio"]
    },
    {
        id: "education",
        category: "Personal",
        title: "Education History",
        text: `Degree: B.Tech in Computer Science and Engineering.
Institution: Institute of Technology, Nirma University (2023-2027).
Performance: Current CGPA 8.46/10.00.
Key Coursework: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), Database Management Systems (DBMS), Machine Learning (ML), Operating Systems (OS).
High School: Purohit Science School (HSC) - 78.7%. ACPC State Rank: 529.`,
        topics: ["education", "university", "cgpa", "courses"]
    },
    {
        id: "skills",
        category: "Skills",
        title: "Technical Skills",
        text: `Programming Languages: Java, Python, JavaScript.
Frameworks & Libraries: Spring Boot, Node.js, Express.js, React.js, Scikit-learn, XGBoost.
Web Technologies: HTML, CSS, REST APIs.
Databases: MySQL, MongoDB.
Tools & Platforms: Docker, Git, GitHub, Postman, KNIME, Jupyter.
Soft Skills: Problem Solving, Team Collaboration.`,
        topics: ["skills", "java", "python", "javascript", "react", "node", "spring boot"]
    },
    {
        id: "achievements",
        category: "Achievements",
        title: "Coding Achievements & Certifications",
        text: `Competitive Programming:
- LeetCode: Solved 500+ questions. Max Rating: 1582.
- Codeforces: Max Rating 966.
Certifications:
- Google Developer Group Solution Challenge 2025.
- AICTE Internship on AI (TechSaksham).`,
        topics: ["leetcode", "codeforces", "awards", "certifications"]
    },
    {
        id: "experience-internship",
        category: "Experience",
        title: "AI Internship at TechSaksham",
        text: `Role: AI Intern at TechSaksham (Microsoft & SAP Initiative).
Dates: Dec 2024 - Jan 2025 (Remote).
Key Projects during Internship:
1. Gesture-controlled music player using DeepFace, MediaPipe, and OpenCV.
2. AI-powered mood-based music recommendation system using Streamlit.
Impact: Enhanced real-time user interaction with facial and gesture recognition technologies.`,
        topics: ["internship", "experience", "ai", "computervision", "microsoft"]
    },
    {
        id: "pagerank-overview",
        category: "Project",
        title: "PageRank Visualizer - Overview",
        text: `Project Name: Page Rank Visualizer.
Description: An interactive web app that visualizes Google’s PageRank algorithm in action. It treats the web as a graph where links are votes of confidence.
Core Logic: Uses the iterative formula PR(v) = (1 - d) / N + d * Σ [ PR(u) / L(u) ] where 'd' is the damping factor (default 0.85).
Features: Users can draw graphs, add nodes/edges, adjust damping factors, and watch rank scores update in real-time.`,
        topics: ["pagerank", "algorithm", "graph", "visualization"]
    },
    {
        id: "pagerank-tech",
        category: "Project",
        title: "PageRank Visualizer - Tech Stack",
        text: `Tech Stack for PageRank Visualizer:
Frontend: React.js, JavaScript, CSS (Deployed on Vercel).
Backend: Java, Spring Boot, Maven (Containerized with Docker).
Database: MongoDB (for storing graph states).
Architecture: REST API communication between React frontend and Spring Boot backend.`,
        topics: ["java", "spring boot", "react", "docker", "maven"]
    },
    {
        id: "rul-overview",
        category: "Project",
        title: "Predictive Maintenance (RUL) - Overview",
        text: `Project Name: Predictive Maintenance Using Sensor Data.
Goal: Estimate the Remaining Useful Life (RUL) of turbofan engines using the NASA C-MAPSS dataset (FD001).
Approach: A machine learning regression problem to predict engine failure before it occurs using sensor data (temperature, pressure, vibration).
Pipeline: Data loading -> EDA -> Feature Engineering -> Model Training -> Evaluation.`,
        topics: ["machine learning", "python", "predictive maintenance", "nasa"]
    },
    {
        id: "rul-results",
        category: "Project",
        title: "Predictive Maintenance (RUL) - Results",
        text: `Model Performance for RUL Prediction:
Tested Models: Linear Regression, SVR, Decision Tree, Random Forest, XGBoost.
Best Model: XGBoost Regressor.
Performance Metrics: 
- RMSE (Root Mean Square Error): 19.85 (Lower is better).
- R² Score: 0.77 (Higher is better).
Key Insight: Sensor data patterns showed clear degradation trends over the engine lifecycle.`,
        topics: ["xgboost", "rmse", "results", "accuracy", "data science"]
    },
    {
        id: "luxelodge-overview",
        category: "Project",
        title: "LuxeLodge - Overview",
        text: `Project Name: LuxeLodge.
Description: A comprehensive full-stack lodge management system.
Features:
- User Authentication: Secure login/signup using Passport.js.
- Role-Based Access: Admin control panels and user dashboards.
- Media Management: Dynamic image uploading using Cloudinary.
- Booking System: Users can list rooms, view availability, and book stays.`,
        topics: ["web dev", "full stack", "management system", "booking"]
    },
    {
        id: "luxelodge-tech",
        category: "Project",
        title: "LuxeLodge - Tech Stack",
        text: `Tech Stack for LuxeLodge:
Backend: Node.js, Express.js.
Frontend: EJS Templating (Server-side rendering), Bootstrap, CSS.
Database: MongoDB (Mongoose ORM).
Auth & Media: Passport.js for security, Cloudinary for image storage.`,
        topics: ["node.js", "express", "mongodb", "ejs", "cloudinary"]
    }
];

async function ensureIndex() {
    console.log(`Checking Pinecone index: "${CONFIG.pineconeIndex}"...`);
    try {
        const list = await pinecone.listIndexes();
        const indexes = list.indexes ? list.indexes : list;
        const existingIndex = indexes.find(i => (i.name || i) === CONFIG.pineconeIndex);

        if (existingIndex) {
            console.log(`   Found index "${CONFIG.pineconeIndex}". Checking dimensions...`);
            try {
                const description = await pinecone.describeIndex(CONFIG.pineconeIndex);
                if (description.dimension === CONFIG.embeddingDim) {
                    console.log("Index exists and dimensions match.");
                    return;
                }
                console.log(`Dimension Mismatch! Index has ${description.dimension}, but we need ${CONFIG.embeddingDim}.`);
                console.log("Deleting old index to recreate it with correct dimensions...");
                await pinecone.deleteIndex(CONFIG.pineconeIndex);
                console.log("Deletion in progress... Waiting 20 seconds to ensure cleanup...");
                await new Promise(r => setTimeout(r, 20000));
            } catch (descError) {
                console.log("   (Could not describe index, assuming it needs recreation due to error context)");
            }
        }

        console.log(`Creating Index "${CONFIG.pineconeIndex}" (Dims: ${CONFIG.embeddingDim})...`);
        await pinecone.createIndex({
            name: CONFIG.pineconeIndex,
            dimension: CONFIG.embeddingDim,
            metric: "cosine",
            spec: {
                serverless: { cloud: "aws", region: "us-east-1" },
            },
        });
        console.log("Index created. Waiting 30s for initialization...");
        await new Promise(r => setTimeout(r, 30000));
    } catch (err) {
        console.error("Error ensuring index:", err);
        process.exit(1);
    }
}

async function generateEmbedding(text) {
    try {
        const model = genAI.getGenerativeModel({ model: CONFIG.modelName });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (err) {
        console.error("Embedding generation failed:", err.message);
        throw err;
    }
}

async function seed() {
    try {
        console.log("Starting Seeding Process...");
        await ensureIndex();

        const index = pinecone.index(CONFIG.pineconeIndex);
        const vectors = [];

        console.log(`Processing ${rawData.length} data chunks...`);

        for (const [i, item] of rawData.entries()) {
            const contentToEmbed = `${item.title}:\n${item.text}`;
            const embedding = await generateEmbedding(contentToEmbed);

            vectors.push({
                id: item.id,
                values: embedding,
                metadata: {
                    text: item.text,
                    title: item.title,
                    category: item.category,
                    topics: item.topics
                }
            });

            process.stdout.write(`\rEmbeddings generated: ${i + 1}/${rawData.length}`);
        }

        console.log("\nUpserting vectors to Pinecone...");
        await index.upsert(vectors);

        console.log("SUCCESS: Portfolio data successfully indexed!");
        console.log("---------------------------------------------");
        console.log(`Index: ${CONFIG.pineconeIndex}`);
        console.log(`Vectors: ${vectors.length}`);
        console.log(`Model: ${CONFIG.modelName}`);

    } catch (error) {
        console.error("CRITICAL ERROR:", error);
        process.exit(1);
    }
}

seed();