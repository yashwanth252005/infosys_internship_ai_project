// frontend/src/pages/Cart.jsx
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Cart() {

    const navigate = useNavigate();
    const { user } = useAuth();

    const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (cartItems.length === 0) {
        return (
            <div className="relative overflow-hidden min-h-[80vh] flex items-center justify-center">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto text-center px-4"
                >
                    {/* Empty cart illustration */}
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                        className="text-9xl mb-6"
                    >
                        🛒
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/50"
                    >
                        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Your Cart is Empty
                        </h1>
                        <p className="text-gray-600 text-lg mb-8">
                            Add some goodies for your furry friend to get started! 🐕
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
                </motion.div>
            </div>
        );
    }

    const handleCheckout = async () => {
        try {
            await api.post("/api/orders", {
                user_id: user.id,
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                total,
            });

            alert("Order placed successfully! 🐶🛒");
            clearCart();
        } catch (err) {
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <div className="relative overflow-hidden min-h-screen">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10" />

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-extrabold mb-2 flex text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 gap-3 justify-center">
                        <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            🛒 Your Shopping Cart
                        </span>
                    </h1>
                    <p className="text-gray-600">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group relative"
                            >
                                {/* Gradient glow on hover */}
                                {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" /> */}

                                {/* Card border */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="h-full w-full bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-sm rounded-2xl" />
                                </div>

                                {/* Content */}
                                <div className="relative p-6 flex items-center gap-6">
                                    {/* Product Image */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-3 group-hover:scale-110 transition-transform duration-300 shadow-md overflow-hidden"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </motion.div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-gray-800 mb-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-600 font-semibold text-lg">
                                            ₹{item.price.toLocaleString()} each
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 hover:from-indigo-600 hover:to-primary text-white flex items-center justify-center font-bold shadow-md"
                                        >
                                            −
                                        </motion.button>

                                        <span className="w-12 text-center font-bold text-xl text-gray-800">
                                            {item.quantity}
                                        </span>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 hover:from-indigo-600 hover:to-primary text-white flex items-center justify-center font-bold shadow-md"
                                        >
                                            +
                                        </motion.button>
                                    </div>

                                    {/* Price & Remove */}
                                    <div className="text-right">
                                        <p className="font-bold text-2xl text-primary mb-3">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline"
                                        >
                                            🗑️ Remove
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary - Sticky */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:sticky lg:top-24 h-fit"
                    >
                        <div className="relative group">
                            {/* Gradient glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl opacity-50 group-hover:opacity-100 blur-xl transition-opacity duration-300" />

                            {/* Card */}
                            <div className="relative bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
                                <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
                                    💰 Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span className="font-medium">Total Items</span>
                                        <span className="font-bold text-lg">{cartItems.length}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-700">
                                        <span className="font-medium">Subtotal</span>
                                        <span className="font-bold text-lg">₹{total.toLocaleString()}</span>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xl text-gray-800">Total</span>
                                        <span className="font-extrabold text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            ₹{total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={handleCheckout}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition text-lg flex items-center justify-center gap-2"
                                >
                                    ✅ Place Order
                                </motion.button>

                                <motion.button
                                    onClick={() => navigate("/shop")}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-3 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                                >
                                    🛍️ Continue Shopping
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}