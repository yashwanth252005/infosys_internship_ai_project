// frontend/src/pages/Home.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import hero_image from "../assets/hero_image.png";

export default function Home() {
    const navigate = useNavigate();

    // Floating animation variants
    const floatingAnimation = {
        y: [0, -20, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    // Stagger container for features
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10" />

            {/* Animated Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-full blur-3xl -z-5"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-40 left-20 w-96 h-96 bg-gradient-to-br from-indigo-300/40 to-blue-300/40 rounded-full blur-3xl -z-5"
            />

            <div className="max-w-7xl mx-auto px-6">

                {/* ================= HERO SECTION ================= */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-24">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-8"
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            Understand Your Dog <br />
                            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                                Like Never Before
                            </span>🐶
                        </h1>

                        <p className="text-gray-700 text-lg max-w-xl">
                            Predict dog breeds from images, explore detailed breed
                            insights, personalized diet plans, chat with an AI dog
                            assistant, and shop essentials — all in one smart platform.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/predict")}
                                className="px-7 py-3 rounded-2xl bg-primary text-white font-semibold shadow-lg hover:shadow-xl transition"
                            >
                                🧬 Predict Breed
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/chat")}
                                className="px-7 py-3 rounded-2xl bg-secondary text-white font-semibold shadow-lg hover:shadow-xl transition"
                            >
                                💬 Chat with PawXpert
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/shop")}
                                className="px-7 py-3 rounded-2xl bg-accent text-white font-semibold shadow-lg hover:shadow-xl transition"
                            >
                                🛒 Shop Products
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Illustration Card - Enhanced */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                        className="flex justify-center relative"
                    >
                        {/* Animated Glow Effect */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
                        />

                        {/* Rotating Border */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: "conic-gradient(from 0deg, transparent 0deg, rgba(139, 92, 246, 0.4) 90deg, transparent 180deg, rgba(236, 72, 153, 0.4) 270deg, transparent 360deg)",
                                filter: "blur(20px)"
                            }}
                        />

                        {/* Card Container with Floating Animation */}
                        <motion.div
                            animate={floatingAnimation}
                            className="relative bg-gradient-to-br from-white/90 to-purple-50/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/50"
                        >
                            {/* Sparkle Decorations */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 1],
                                    rotate: [0, 180, 360],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-3 -right-3 text-3xl"
                            >
                                ✨
                            </motion.div>
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [360, 180, 0],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -bottom-3 -left-3 text-2xl"
                            >
                                🌟
                            </motion.div>

                            {/* Image with hover effect */}
                            <motion.img
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                src={hero_image}
                                // src="/hero_image.png"
                                alt="Dog Illustration"
                                width={500}
                                height={500}
                                className="max-w-md w-full drop-shadow-2xl relative z-10"
                            />

                            {/* Paw prints decoration */}
                            <motion.div
                                animate={{ y: [-5, 5, -5], x: [-3, 3, -3] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute top-10 -left-8 text-4xl opacity-60"
                            >
                                🐾
                            </motion.div>
                            <motion.div
                                animate={{ y: [5, -5, 5], x: [3, -3, 3] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute bottom-20 -right-8 text-3xl opacity-60"
                            >
                                🐾
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ================= FEATURES SECTION ================= */}
                <section className="pb-24">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: "🐕",
                                title: "AI Breed Prediction",
                                desc: "Upload a dog image and instantly identify its breed with confidence.",
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: "🥗",
                                title: "Personalized Diet Plans",
                                desc: "Healthy diet recommendations tailored to breed and life stage.",
                                gradient: "from-green-500 to-emerald-500"
                            },
                            {
                                icon: "🤖",
                                title: "Smart Dog Assistant",
                                desc: "Chat with AI using text or images to understand your dog better.",
                                gradient: "from-purple-500 to-pink-500"
                            },
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -12, scale: 1.03 }}
                                className="relative group bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300 border border-white/50 overflow-hidden"
                            >
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                {/* Animated icon */}
                                <motion.div
                                    className="text-5xl mb-4 relative z-10"
                                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {feature.icon}
                                </motion.div>

                                <h3 className="text-xl font-semibold mb-2 relative z-10">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 relative z-10">
                                    {feature.desc}
                                </p>

                                {/* Decorative corner */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className={`absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity`}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ================= FINAL CTA ================= */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="pb-28 text-center"
                >
                    <div className="relative bg-gradient-to-r from-primary via-purple-600 to-indigo-700 rounded-3xl p-12 shadow-2xl text-white overflow-hidden">
                        {/* Animated background patterns */}
                        <motion.div
                            animate={{
                                x: [0, 100, 0],
                                y: [0, -50, 0],
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{
                                x: [0, -100, 0],
                                y: [0, 50, 0],
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                        />

                        {/* Content */}
                        <div className="relative z-10">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl md:text-4xl font-bold mb-4"
                            >
                                Your dog deserves smarter care 🐾
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-white/90 mb-8 text-lg"
                            >
                                Start predicting, chatting, and caring — powered by AI.
                            </motion.p>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                                whileHover={{ scale: 1.08, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/predict")}
                                className="px-10 py-4 rounded-2xl bg-white text-primary font-bold shadow-lg hover:shadow-2xl transition relative overflow-hidden group"
                            >
                                <span className="relative z-10">Get Started 🚀</span>
                                {/* Shimmer effect */}
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                            </motion.button>
                        </div>
                    </div>
                </motion.section>

            </div>
        </div>
    );
}