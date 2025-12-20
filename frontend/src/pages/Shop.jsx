// frontend/src/pages/Shop.jsx
import products from "../data/products";
import { useCart } from "../contexts/CartContext";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Shop() {

    const { addToCart } = useCart();
    const [addedItems, setAddedItems] = useState({});

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedItems(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [product.id]: false }));
        }, 2000);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 0.8
            }
        }
    };

    return (
        <div className="relative overflow-hidden min-h-screen">
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

            <div className="max-w-7xl mx-auto px-6 py-12 relative">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                        className="inline-block mb-4"
                    >
                        <span className="text-6xl">🛍️</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Dog Products Shop
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600 text-lg max-w-2xl mx-auto"
                    >
                        Premium quality products for your furry friend 🐾
                    </motion.p>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            variants={cardVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl p-6 flex flex-col overflow-hidden border border-white/50 transition-all duration-300"
                        >
                            {/* Gradient overlay on hover */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 0.1 }}
                                className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-pink-500 pointer-events-none"
                            />

                            {/* Decorative corner */}
                            <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Product Image Container */}
                            <motion.div
                                className="relative h-48 mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-40 w-auto object-contain drop-shadow-lg relative z-10"
                                />

                                {/* Animated sparkle */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 360],
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute top-2 right-2 text-2xl"
                                >
                                    ✨
                                </motion.div>
                            </motion.div>

                            {/* Product Info */}
                            <div className="flex-1 relative z-10">
                                <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Price and Button */}
                                <div className="flex justify-between items-center mt-auto">
                                    <motion.span
                                        className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        ₹{product.price}
                                    </motion.span>

                                    <motion.button
                                        onClick={() => handleAddToCart(product)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`relative px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 overflow-hidden ${addedItems[product.id]
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-xl'
                                            }`}
                                    >
                                        <span className="relative z-10">
                                            {addedItems[product.id] ? '✓ Added!' : '🛒 Add to Cart'}
                                        </span>

                                        {/* Button shimmer effect */}
                                        {!addedItems[product.id] && (
                                            <motion.div
                                                animate={{ x: ["-100%", "200%"] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                            />
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Paw print decoration */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 0.1, scale: 1 }}
                                className="absolute -bottom-4 -left-4 text-8xl pointer-events-none"
                            >
                                🐾
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-block bg-gradient-to-r from-primary/10 to-purple-600/10 backdrop-blur-xl rounded-3xl px-8 py-6 border border-primary/20">
                        <p className="text-lg text-gray-700 mb-2">
                            🎁 <span className="font-semibold">Free shipping</span> on orders above ₹999
                        </p>
                        <p className="text-sm text-gray-600">
                            Quality products delivered to your doorstep 🚚
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}