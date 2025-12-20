// frontend/src/components/ChatHistorySidebar.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";

export default function ChatHistorySidebar({ onClose, sessions, currentSessionId, onSessionSelect, onNewChat, onRefresh }) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

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

    const handleStartEdit = (session) => {
        setEditingId(session._id);
        setEditName(session.session_name);
    };

    const handleSaveEdit = async (sessionId) => {
        if (!editName.trim()) return;

        try {
            await api.put(`/api/chat-sessions/${sessionId}`, {
                session_name: editName
            });
            await onRefresh();
            setEditingId(null);
        } catch (err) {
            console.error("Failed to update session name:", err);
        }
    };

    const handleDelete = async (sessionId) => {
        try {
            await api.delete(`/api/chat-sessions/${sessionId}`);
            await onRefresh();
            setDeleteConfirm(null);

            // If deleted session was active, create a new one
            if (sessionId === currentSessionId) {
                onNewChat();
            }
        } catch (err) {
            console.error("Failed to delete session:", err);
        }
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
                            Chat Sessions
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {sessions.length} {sessions.length === 1 ? 'conversation' : 'conversations'}
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

                {/* New Chat Button */}
                <div className="p-4 border-b border-white/20">
                    <motion.button
                        onClick={onNewChat}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <span className="text-2xl">+</span>
                        <span>New Chat Session</span>
                    </motion.button>
                </div>

                {/* Sessions List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {sessions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center p-8"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <span className="text-5xl">💬</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                No chat sessions yet
                            </h3>
                            <p className="text-sm text-gray-600 max-w-xs">
                                Start a new conversation to begin chatting with your Dog Assistant.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {sessions.map((session, idx) => (
                                    <motion.div
                                        key={session._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`group rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${session._id === currentSessionId
                                                ? "bg-gradient-to-r from-primary/20 to-indigo-100/70 border-2 border-primary/40"
                                                : "bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-primary/30"
                                            }`}
                                    >
                                        <div className="p-4">
                                            {/* Session Header */}
                                            <div className="flex items-start justify-between mb-2">
                                                {editingId === session._id ? (
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") handleSaveEdit(session._id);
                                                            if (e.key === "Escape") setEditingId(null);
                                                        }}
                                                        onBlur={() => handleSaveEdit(session._id)}
                                                        className="flex-1 px-2 py-1 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <button
                                                        onClick={() => onSessionSelect(session._id)}
                                                        className="flex-1 text-left"
                                                    >
                                                        <h3 className="text-base font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
                                                            {session.session_name}
                                                        </h3>
                                                    </button>
                                                )}

                                                {editingId !== session._id && (
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleStartEdit(session)}
                                                            className="p-1.5 hover:bg-primary/10 rounded-lg transition"
                                                            title="Edit name"
                                                        >
                                                            ✏️
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setDeleteConfirm(session._id)}
                                                            className="p-1.5 hover:bg-red-100 rounded-lg transition"
                                                            title="Delete session"
                                                        >
                                                            🗑️
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Last Message Preview */}
                                            {session.last_message && (
                                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                    {session.last_message}
                                                </p>
                                            )}

                                            {/* Session Meta */}
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    💬 {session.message_count || 0} messages
                                                </span>
                                                <span>{formatTimestamp(session.updated_at)}</span>
                                            </div>

                                            {/* Active Indicator */}
                                            {session._id === currentSessionId && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary"
                                                >
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                                    Active
                                                </motion.div>
                                            )}

                                            {/* Delete Confirmation */}
                                            {deleteConfirm === session._id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="mt-3 pt-3 border-t border-gray-200"
                                                >
                                                    <p className="text-xs text-gray-700 mb-2">
                                                        Delete this conversation?
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(session._id)}
                                                            className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
}
