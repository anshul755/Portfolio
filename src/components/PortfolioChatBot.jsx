import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Copy, Check, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";

const PortfolioChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm **Portfolio Assistant**\n\nI can tell you about Anshul's **projects**, **tech stack**, or how to **get in touch**. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retrievedDocs, setRetrievedDocs] = useState([]);
  const [showSources, setShowSources] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isOpen]);

  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) {
      root.classList.add('chat-open');
    } else {
      root.classList.remove('chat-open');
    }
    return () => root.classList.remove('chat-open');
  }, [isOpen]);

  const formatAnswer = (text) => {
    if (!text) return text;
    let formatted = text
      .replace(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, '**$&**')
      .replace(/\+?\d{10,15}\b/g, '**$&**')
      .replace(/(\w+\.(com|in|io|dev|edu))/g, '**$1**')
      .replace(/LinkedIn|GitHub|LeetCode|Codeforces|Spring Boot|React\.js|Node\.js|Express\.js|MongoDB|MySQL|XGBoost|Docker/g, '**$&**')
      .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2')
      .replace(/(\d+\.\s+)/g, '$1')
      .replace(/,\s*(and\s*)?([A-Z])/g, '.\n- $2');
    return formatted;
  };

  const generateResponse = async (userQuery) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch('https://rag-chatbot-wheat-pi.vercel.app/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuery }),
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error('Server returned invalid JSON.');
      }

      if (!response.ok) {
        throw new Error(data?.error || "Unknown server error");
      }

      const formattedAnswer = formatAnswer(data.answer);
      setMessages((prev) => [...prev, { role: "assistant", content: formattedAnswer }]);

      if (data.sources) {
        setRetrievedDocs(data.sources.map((text, idx) => ({ id: idx, content: text })));
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `**System Error:** ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    await generateResponse(userMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group
          ${isOpen
            ? "bg-neutral-900 border border-orange-500/50 rotate-90"
            : "bg-black border border-orange-500 shadow-orange-500/20 hover:shadow-orange-500/40"
          }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-orange-500" />
        ) : (
          <MessageCircle className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed bottom-24 right-4 md:right-6 w-[90vw] md:w-[380px] h-[500px] max-h-[70vh] z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-orange-500/30 bg-black/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/50 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Ask About Me</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] px-4 py-3 text-sm leading-[1.6] shadow-sm
                    ${msg.role === "user"
                      ? "bg-orange-600 text-white rounded-2xl rounded-tr-sm"
                      : "bg-neutral-900 border border-white/10 text-neutral-200 rounded-2xl rounded-tl-sm"
                    }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none 
                      prose-p:leading-relaxed prose-p:my-1.5
                      prose-strong:text-orange-400 prose-strong:font-bold
                      prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
                      prose-ul:my-2 prose-li:my-0 prose-li:pl-4
                      prose-ol:my-2 prose-li:pl-6
                      prose-code:text-orange-300 prose-code:bg-black/50 prose-code:px-1 prose-code:rounded prose-code:border prose-code:border-white/10
                      [&>p]:break-words [&>p]:hyphens-auto
                      [&>p]:mb-2
                    ">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-900 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                  <span className="text-xs text-neutral-400 font-mono">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showSources && retrievedDocs.length > 0 && (
            <div className="bg-neutral-900/80 border-t border-white/10 max-h-40 overflow-y-auto custom-scrollbar">
              <style>{`
                      .custom-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #3a2a1a #0f0f0f;
                      }
                      .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #3a2a1a;
                        border-radius: 6px;
                        border: 2px solid #0f0f0f;
                      }
                      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a6531a; }

                      .chat-open, .chat-open body, .chat-open ::-webkit-scrollbar, .chat-open ::-webkit-scrollbar-track {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(0,0,0,0.5) transparent;
                      }
                      .chat-open ::-webkit-scrollbar { width: 10px; }
                      .chat-open ::-webkit-scrollbar-track { background: transparent; }
                      .chat-open ::-webkit-scrollbar-thumb {
                        background: rgba(0,0,0,0.55);
                        border-radius: 8px;
                        border: 2px solid rgba(0,0,0,0.15);
                      }
                      .chat-open ::-webkit-scrollbar-thumb:hover { background: rgba(58,42,26,0.9); }
                    `}
              </style>
              <div className="p-3 space-y-2">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Reference Context</p>
                {retrievedDocs.map((doc, i) => (
                  <div key={i} className="group relative p-2 bg-black/40 border border-white/5 rounded hover:border-orange-500/30 transition-colors">
                    <p className="text-xs text-neutral-400 line-clamp-2 font-mono">{doc.content}</p>
                    <button
                      onClick={() => copyToClipboard(doc.content, i)}
                      className="absolute right-2 top-2 p-1 text-neutral-600 hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedIdx === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-black border-t border-white/10">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about my skills..."
                disabled={isLoading}
                className="w-full bg-neutral-900 text-white text-sm rounded-full pl-5 pr-12 py-3.5 border border-white/10 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 placeholder-neutral-500 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioChatbot;