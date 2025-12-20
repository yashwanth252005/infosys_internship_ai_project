// frontend/src/pages/Chat_BACKUP.jsx
import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import ChatHistorySidebar from "../components/ChatHistorySidebar";
import { motion, AnimatePresence } from "framer-motion";
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

    // Session management states
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [showNameModal, setShowNameModal] = useState(false);
    const [sessionName, setSessionName] = useState("");

    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);

    // Load or create initial session on mount
    useEffect(() => {
        const initializeSession = async () => {
            try {
                // Get user's sessions
                const res = await api.get(`/api/chat-sessions/user/${user.id}`);
                const userSessions = res.data;
                setSessions(userSessions);

                if (userSessions && userSessions.length > 0) {
                    // Find active session or use the most recent
                    const activeSession = userSessions.find(s => s.is_active) || userSessions[0];
                    setCurrentSessionId(activeSession._id);

                    // Load messages for this session
                    await loadSessionMessages(activeSession._id);
                } else {
                    // Create first session automatically
                    await createNewSession("New Chat", true);
                }
            } catch (err) {
                console.error("Failed to initialize session:", err);
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

        initializeSession();
    }, [user.id]);

    // Load messages for a specific session
    const loadSessionMessages = async (sessionId) => {
        try {
            const res = await api.get(`/api/chat-sessions/${sessionId}/messages`);
            const history = res.data;

            if (history && history.length > 0) {
                const formattedMessages = history.map(chat => ({
                    role: chat.role === "user" ? "user" : "bot",
                    content: chat.message,
                    image: chat.image || null
                }));
                setMessages(formattedMessages);
            } else {
                // Show welcome message if no messages
                setMessages([
                    {
                        role: "bot",
                        content: "Hi! I'm your Dog Assistant 🐶 Ask me anything about dog breeds.",
                    },
                ]);
            }

            console.log(`Loaded ${history?.length || 0} messages for session ${sessionId}`);
        } catch (err) {
            console.error("Failed to load session messages:", err);
            setMessages([
                {
                    role: "bot",
                    content: "Hi! I'm your Dog Assistant 🐶 Ask me anything about dog breeds.",
                },
            ]);
        }
    };

    // Create new session
    const createNewSession = async (name, isInitial = false) => {
        try {
            const res = await api.post("/api/chat-sessions/", {
                user_id: user.id,
                session_name: name
            });

            setCurrentSessionId(res.data.session_id);
            setMessages([
                {
                    role: "bot",
                    content: "Hi! I'm your Dog Assistant 🐶 Ask me anything about dog breeds.",
                },
            ]);

            // Refresh sessions list if not initial creation
            if (!isInitial) {
                const sessionsRes = await api.get(`/api/chat-sessions/user/${user.id}`);
                setSessions(sessionsRes.data);
            }

            setShowNameModal(false);
            setSessionName("");
        } catch (err) {
            console.error("Failed to create session:", err);
        }
    };

    // Handle new chat button
    const handleNewChat = () => {
        if (messages.length > 1) { // More than just welcome message
            setShowNameModal(true);
        } else {
            createNewSession("New Chat");
        }
    };

    // Switch to a different session
    const switchSession = async (sessionId) => {
        console.log(`Switching to session: ${sessionId}`);
        setCurrentSessionId(sessionId);
        setLoadingHistory(true);

        try {
            // Set as active session
            await api.post(`/api/chat-sessions/${sessionId}/set-active?user_id=${user.id}`);

            // Load messages for this session
            await loadSessionMessages(sessionId);

            // Refresh sessions to update active status
            const sessionsRes = await api.get(`/api/chat-sessions/user/${user.id}`);
            setSessions(sessionsRes.data);
        } catch (err) {
            console.error("Failed to switch session:", err);
        } finally {
            setLoadingHistory(false);
            setShowHistory(false);
        }
    };

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
        if (!currentSessionId) {
            console.error("No active session");
            return;
        }

        const userMessage = {
            role: "user",
            content: input || "📷 Image uploaded",
            image: imageFile ? URL.createObjectURL(imageFile) : null,
        };

        // Save to backend with session_id
        await api.post("/api/chat-history", {
            user_id: user.id,
            session_id: currentSessionId,
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
                session_id: currentSessionId,
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
                    <ChatHistorySidebar
                        onClose={() => setShowHistory(false)}
                        sessions={sessions}
                        currentSessionId={currentSessionId}
                        onSessionSelect={switchSession}
                        onNewChat={handleNewChat}
                        onRefresh={async () => {
                            const res = await api.get(`/api/chat-sessions/user/${user.id}`);
                            setSessions(res.data);
                        }}
                    />
                )}

                {/* Session Name Modal */}
                <AnimatePresence>
                    {showNameModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowNameModal(false)}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            >
                                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
                                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                        Name This Chat Session
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Give a meaningful name to this conversation
                                    </p>
                                    <input
                                        type="text"
                                        value={sessionName}
                                        onChange={(e) => setSessionName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && sessionName.trim()) {
                                                createNewSession(sessionName);
                                            }
                                        }}
                                        placeholder="e.g., Golden Retriever Diet"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-6"
                                        autoFocus
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowNameModal(false)}
                                            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => sessionName.trim() && createNewSession(sessionName)}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Header with buttons */}
                <div className="flex items-center gap-3 mb-4">
                    <motion.button
                        onClick={() => setShowHistory(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-gray-700 flex items-center gap-2"
                    >
                        <span className="text-xl">☰</span>
                        <span>Chat History</span>
                    </motion.button>

                    <motion.button
                        onClick={handleNewChat}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl hover:shadow-xl shadow-lg transition-all duration-300 font-semibold flex items-center gap-2"
                    >
                        <span className="text-xl">+</span>
                        <span>New Chat</span>
                    </motion.button>
                </div>

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

                {/* Sample Questions - Only show for new sessions with no conversation */}
                {!loadingHistory && sampleQuestions.length > 0 && messages.length === 1 && messages[0].role === "bot" && (
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
                                <p className="text-gray-600 font-medium">Loading chat...</p>
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
