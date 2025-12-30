// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import authBackground from "../assets/auth_background.avif";


export default function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await signIn(email, password);
            if (error) throw error;

            toast.success("Welcome back 🐶");
            navigate("/");
        } catch (err) {
            toast.error(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                onClick={() => navigate("/")}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-full max-w-4xl mx-4 grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* LEFT PANEL */}
                <div
                    className="hidden md:flex flex-col justify-between p-10 text-white relative overflow-hidden"
                    style={{
                        backgroundImage: `url(${authBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Overlay with gradient and blur effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/85 to-pink-900/90 backdrop-blur-sm" />

                    {/* Content */}
                    <div className="relative z-10 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-4xl font-extrabold mb-3 drop-shadow-lg">
                                PawXpert 🐾
                            </h2>
                            <p className="text-lg text-white/95 font-medium">
                                Understand your dog like never before.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4 pt-6"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🔍</span>
                                <div>
                                    <h3 className="font-semibold text-lg">Breed Recognition</h3>
                                    <p className="text-white/80 text-sm">AI-powered breed identification</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🥗</span>
                                <div>
                                    <h3 className="font-semibold text-lg">Custom Diet Plans</h3>
                                    <p className="text-white/80 text-sm">Personalized nutrition advice</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">💬</span>
                                <div>
                                    <h3 className="font-semibold text-lg">AI Assistant</h3>
                                    <p className="text-white/80 text-sm">24/7 dog care guidance</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4"
                        >
                            <p className="text-sm italic text-white/90">
                                "The best app for understanding and caring for my furry friend!"
                            </p>
                            <p className="text-xs text-white/70 mt-2">— Happy Dog Parent</p>
                        </motion.div>
                        <p className="text-sm text-white/70">
                            © 2025 PawXpert. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">
                            Welcome Back! 👋
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Login to continue your dog care journey
                        </p>
                    </motion.div>

                    {/* Social Login (UI ready) */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        disabled
                        className="w-full mb-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-2 font-medium text-gray-700"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google (coming soon)
                    </motion.button>

                    <div className="relative my-6 flex items-center justify-center">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
                        <span className="relative bg-gradient-to-br from-gray-50 to-white px-4 text-sm text-gray-500 font-medium">
                            or
                        </span>
                    </div>

                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Continue →"
                            )}
                        </motion.button>
                    </motion.form>

                    <motion.p
                        className="text-sm text-center mt-6 text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}