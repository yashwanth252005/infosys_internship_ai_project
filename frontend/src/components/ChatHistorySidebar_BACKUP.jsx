// frontend/src/components/ChatHistorySidebar_BACKUP.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

export default function ChatHistorySidebar({ onClose }) {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedChats, setExpandedChats] = useState({});

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await api.get(
                    `/api/chat-history/user/${user.id}`
                );
                setChats(res.data);
            } catch (err) {
                console.error("Failed to fetch chat history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [user]);

    const toggleExpand = (chatId) => {
        setExpandedChats(prev => ({
            ...prev,
            [chatId]: !prev[chatId]
        }));
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days === 0) {
            if (hours === 0) return 'Just now';
            return `${hours}h ago`;
        }
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.div
                initial={{ x: -400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -400, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-96 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 backdrop-blur-xl shadow-2xl z-50 overflow-hidden flex flex-col border-r border-white/20"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/20 bg-white/50 backdrop-blur-sm">
                    <div>
                        <h2 className="font-bold text-2xl bg-gradient-to-r from-primary via-indigo-700 to-purple-600 bg-clip-text text-transparent">
                            Chat History
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {chats.length} {chats.length === 1 ? 'message' : 'messages'}
                        </p>
                    </div>
                    <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-gradient-to-r hover:from-primary hover:to-indigo-700 text-gray-600 hover:text-white transition-all duration-300 shadow-md"
                    >
                        ✕
                    </motion.button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader text="Loading chat history..." />
                        </div>
                    ) : chats.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center p-8"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <span className="text-5xl">🐶</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                No chats yet
                            </h3>
                            <p className="text-sm text-gray-600 max-w-xs">
                                Start a conversation with your Dog Assistant to see your chat history here.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {chats.map((chat, idx) => (
                                    <motion.div
                                        key={chat._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`group rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${chat.role === "user"
                                            ? "bg-gradient-to-r from-primary/10 to-indigo-100/50 border border-primary/20"
                                            : "bg-white/80 backdrop-blur-sm border border-gray-100"
                                            }`}
                                    >
                                        <div
                                            onClick={() => toggleExpand(chat._id)}
                                            className="p-4 cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${chat.role === "user"
                                                            ? "bg-gradient-to-r from-primary to-indigo-700 text-white"
                                                            : "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                                                            }`}
                                                    >
                                                        {chat.role === "user" ? "👤" : "🤖"}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-700">
                                                            {chat.role === "user" ? "You" : "Dog Assistant"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatTimestamp(chat.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: expandedChats[chat._id] ? 180 : 0 }}
                                                    className="text-gray-400 group-hover:text-primary transition-colors"
                                                >
                                                    ↓
                                                </motion.div>
                                            </div>

                                            <p
                                                className={`text-sm text-gray-700 leading-relaxed ${expandedChats[chat._id] ? "" : "line-clamp-2"
                                                    }`}
                                            >
                                                {chat.message}
                                            </p>

                                            {chat.image && (
                                                <img
                                                    src={chat.image}
                                                    alt="uploaded"
                                                    className="mt-3 rounded-xl max-h-32 object-cover shadow-md"
                                                />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {chats.length > 0 && (
                    <div className="p-4 border-t border-white/20 bg-white/50 backdrop-blur-sm">
                        <button
                            onClick={() => setChats([])}
                            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            Clear History
                        </button>
                    </div>
                )}
            </motion.div>
        </>
    );
}