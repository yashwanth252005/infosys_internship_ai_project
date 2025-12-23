// frontend/src/pages/Chat_BACKUP.jsx
import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import ChatHistorySidebar from "../components/ChatHistorySidebar";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function Chat() {
    const [showHistory, setShowHistory] = useState(false);
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [sampleQuestions, setSampleQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);

    // Load chat history on mount
    useEffect(() => {
        const loadChatHistory = async () => {
            try {
                const res = await api.get(`/api/chat-history/user/${user.id}`);
                const history = res.data;

                if (history && history.length > 0) {
                    // Convert backend format to frontend format
                    const formattedMessages = history.map(chat => ({
                        role: chat.role === "user" ? "user" : "bot",
                        content: chat.message,
                        image: chat.image || null
                    }));
                    setMessages(formattedMessages);
                } else {
                    // Show welcome message if no history
                    setMessages([
                        {
                            role: "bot",
                            content: "Hi! I'm your Dog Assistant 🐶 Ask me anything about dog breeds.",
                        },
                    ]);
                }
            } catch (err) {
                console.error("Failed to load chat history:", err);
                // Show welcome message on error
                setMessages([
                    {
                        role: "bot",
                        content: "Hi! I'm your Dog Assistant 🐶 Ask me anything about dog breeds.",
                    },
                ]);
            } finally {
                setLoadingHistory(false);
            }
        };

        loadChatHistory();
    }, [user.id]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        api
            .get("/api/data/sample-questions")
            .then((res) => setSampleQuestions(res.data.questions || []))
            .catch((err) => console.error(err));
    }, []);

    const sendMessage = async () => {
        if (!input.trim() && !imageFile) return;

        const userMessage = {
            role: "user",
            content: input || "📷 Image uploaded",
            image: imageFile ? URL.createObjectURL(imageFile) : null,
        };

        await api.post("/api/chat-history", {
            user_id: user.id,
            role: "user",
            message: userMessage.content,
            image: userMessage.image,
        });

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setImageFile(null);
        setLoading(true);
        if (fileInputRef.current) fileInputRef.current.value = "";

        try {
            const formData = new FormData();
            if (input) formData.append("message", input);
            if (imageFile) formData.append("image", imageFile);

            const res = await api.post("/api/chat/message", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const botMessage = {
                role: "bot",
                content: res.data.answer,
            };

            await api.post("/api/chat-history", {
                user_id: user.id,
                role: "bot",
                message: res.data.answer,
                image: null,
            });

            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content: "Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
            <div className="relative max-w-5xl mx-auto flex flex-col h-[85vh]">
                {/* Chat History Sidebar */}
                {showHistory && (
                    <ChatHistorySidebar onClose={() => setShowHistory(false)} />
                )}

                {/* History Toggle Button */}
                <motion.button
                    onClick={() => setShowHistory(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mb-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 w-fit font-medium text-gray-700 flex items-center gap-2"
                >
                    <span className="text-xl">☰</span>
                    <span>View Chat History</span>
                </motion.button>

                {/* Title with gradient */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-indigo-700 to-purple-600 bg-clip-text text-transparent mb-2">
                        Dog Chat Assistant 🐕
                    </h1>
                    <p className="text-gray-600 text-sm">Your AI companion for all things dogs</p>
                </motion.div>

                {/* Sample Questions */}
                {sampleQuestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-5 flex flex-wrap gap-3"
                    >
                        {sampleQuestions.slice(0, 6).map((q, idx) => (
                            <motion.button
                                key={idx}
                                onClick={() => setInput(q)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-sm px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-gradient-to-r hover:from-primary hover:to-indigo-700 hover:text-white shadow-md hover:shadow-lg transition-all duration-300 font-medium text-gray-700"
                            >
                                {q}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* Chat Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-6 overflow-y-auto space-y-5 border border-white/20"
                >
                    {loadingHistory ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center h-full"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-gradient-to-r from-primary to-indigo-700 rounded-full animate-bounce" />
                                    <span className="w-3 h-3 bg-gradient-to-r from-primary to-indigo-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <span className="w-3 h-3 bg-gradient-to-r from-primary to-indigo-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                                <p className="text-gray-600 font-medium">Loading chat history...</p>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[75%] px-6 py-4 rounded-3xl text-base shadow-lg ${msg.role === "user"
                                            ? "bg-gradient-to-r from-primary to-indigo-700 text-white rounded-br-md"
                                            : "bg-white/90 backdrop-blur-sm text-gray-800 rounded-bl-md border border-gray-100"
                                            }`}
                                    >
                                        {msg.image && (
                                            <img
                                                src={msg.image}
                                                alt="uploaded"
                                                className="mb-3 rounded-2xl max-h-64 shadow-md"
                                            />
                                        )}
                                        {msg.role === "bot" ? (
                                            <ReactMarkdown
                                                components={{
                                                    strong: ({ children }) => (
                                                        <strong className="font-semibold text-primary">
                                                            {children}
                                                        </strong>
                                                    ),
                                                    p: ({ children }) => (
                                                        <p className="mb-2 leading-relaxed">{children}</p>
                                                    ),
                                                    li: ({ children }) => (
                                                        <li className="ml-4 list-disc mb-1">{children}</li>
                                                    ),
                                                    ul: ({ children }) => (
                                                        <ul className="mb-2 space-y-1">{children}</ul>
                                                    ),
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : (
                                            <span className="leading-relaxed">{msg.content}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 text-gray-600 text-base bg-white/60 backdrop-blur-sm px-6 py-4 rounded-3xl rounded-bl-md w-fit shadow-lg"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-indigo-700 rounded-full animate-bounce" />
                                        <span className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-indigo-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <span className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-indigo-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                    <span className="font-medium">Dog Assistant is thinking...</span>
                                </motion.div>
                            )}

                            {/* Scroll anchor */}
                            <div ref={chatEndRef} />
                        </>
                    )}
                </motion.div>


                {/* Input Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 flex items-center gap-3 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-4 border border-white/20"
                >
                    {/* Hidden file input for future use */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="hidden"
                    />

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                        placeholder="Ask about dog breeds, diet, behavior, training..."
                        className="flex-1 px-6 py-4 border-none bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-base"
                    />

                    <motion.button
                        onClick={sendMessage}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-indigo-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                    >
                        <span>{loading ? 'Sending...' : 'Send'}</span>
                        <span className="text-xl">→</span>
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}