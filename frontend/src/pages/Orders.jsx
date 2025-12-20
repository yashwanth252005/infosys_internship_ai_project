// frontend/src/pages/Orders.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { motion } from "framer-motion";
import Loader from "../components/Loader";

export default function Orders() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get(`/api/orders/user/${user.id}`);
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <Loader text="Fetching your orders..." />
        );
    }

    if (orders.length === 0) {
        return (
            <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-full blur-3xl -z-5"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center px-6"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-8xl mb-6"
                    >
                        📦
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        No Orders Yet
                    </h1>

                    <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                        Looks like you haven't bought anything for your furry friend yet. Start shopping now! 🐾
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/shop")}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition relative overflow-hidden group"
                    >
                        <span className="relative z-10">🛒 Go to Shop</span>
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        />
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    // Status badge colors
    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            processing: "bg-blue-100 text-blue-800 border-blue-300",
            shipped: "bg-purple-100 text-purple-800 border-purple-300",
            delivered: "bg-green-100 text-green-800 border-green-300",
            cancelled: "bg-red-100 text-red-800 border-red-300"
        };
        return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: "⏳",
            processing: "📦",
            shipped: "🚚",
            delivered: "✅",
            cancelled: "❌"
        };
        return icons[status] || "📋";
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10" />

            {/* Animated Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-full blur-3xl -z-5"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -50, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-40 left-20 w-96 h-96 bg-gradient-to-br from-indigo-300/40 to-blue-300/40 rounded-full blur-3xl -z-5"
            />

            <div className="max-w-6xl mx-auto px-6 py-12 relative">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                        className="inline-block mb-4"
                    >
                        <span className="text-6xl">📦</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                        <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            My Orders
                        </span>
                    </h1>

                    <p className="text-gray-600 text-lg">
                        Track and manage all your orders in one place 🐾
                    </p>
                </motion.div>

                {/* Orders List */}
                <div className="space-y-8">
                    {orders.map((order, orderIndex) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: orderIndex * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl rounded-3xl p-8 border border-white/50 transition-all duration-300"
                        >
                            {/* Order Header */}
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">
                                        🗓️ {new Date(order.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    <motion.span
                                        whileHover={{ scale: 1.05 }}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border ${getStatusColor(order.status)}`}
                                    >
                                        <span>{getStatusIcon(order.status)}</span>
                                        <span className="capitalize">{order.status}</span>
                                    </motion.span>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                    <motion.p
                                        whileHover={{ scale: 1.1 }}
                                        className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                                    >
                                        ₹{order.total}
                                    </motion.p>
                                </div>
                            </div>

                            {/* Order Items with Images */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-gray-700 mb-4">
                                    📋 Order Items ({order.items.length})
                                </h3>

                                {order.items.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: orderIndex * 0.1 + idx * 0.05 }}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-primary/30 transition-all"
                                    >
                                        {/* Product Image */}
                                        {/* <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="flex-shrink-0 w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-contain"
                                            />
                                        </motion.div> */}

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-800 mb-1 truncate">
                                                {item.name}
                                            </h4>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <span className="font-medium">Qty:</span>
                                                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md font-semibold">
                                                        {item.quantity}
                                                    </span>
                                                </span>
                                                <span className="text-gray-400">•</span>
                                                <span className="font-medium">₹{item.price} each</span>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                                            <p className="text-xl font-bold text-primary">
                                                ₹{item.price * item.quantity}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Order Footer */}
                            {/* <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center"
                            >
                                <p className="text-sm text-gray-500">
                                    Order ID: <span className="font-mono text-gray-700">{order._id.slice(-8)}</span>
                                </p>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition"
                                >
                                    Track Order 🚚
                                </motion.button>
                            </motion.div> */}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}