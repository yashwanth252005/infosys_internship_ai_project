// frontend/src/pages/Breed.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";

export default function Breed() {
    const { breed_name } = useParams();
    const navigate = useNavigate();

    const [breedName, setBreedName] = useState(breed_name || "");
    const [breedInfo, setBreedInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch when coming from /breed/:breed_name (Predict page)
    useEffect(() => {
        if (breed_name) {
            setHasSearched(true);
            fetchBreedInfo(breed_name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breed_name]);

    const fetchBreedInfo = async (name) => {
        if (!name.trim()) return;

        try {
            setLoading(true);
            setError("");
            setBreedInfo(null);
            setHasSearched(true);

            const res = await api.get(`/api/data/breed/${name}`);
            setBreedInfo(res.data.data);
        } catch (err) {
            console.error(err);
            setError("Breed information not found.");
        } finally {
            setLoading(false);
        }
    };

    // Category-based styling with icons and colors
    const getCardStyle = (title) => {
        const categories = {
            physical: {
                fields: ["Height", "Weight", "Colors", "Coat Type", "Shedding Level"],
                gradient: "from-emerald-500 via-green-500 to-teal-500",
                bg: "from-emerald-50/80 to-green-50/60",
                icon: "📏",
                iconBg: "bg-emerald-100",
                textColor: "text-emerald-700"
            },
            behavior: {
                fields: ["Temperament", "Intelligence", "Training Difficulty", "Barking Level"],
                gradient: "from-blue-500 via-indigo-500 to-purple-500",
                bg: "from-blue-50/80 to-indigo-50/60",
                icon: "🧠",
                iconBg: "bg-blue-100",
                textColor: "text-blue-700"
            },
            care: {
                fields: ["Exercise Needs", "Grooming Needs"],
                gradient: "from-purple-500 via-violet-500 to-fuchsia-500",
                bg: "from-purple-50/80 to-violet-50/60",
                icon: "💜",
                iconBg: "bg-purple-100",
                textColor: "text-purple-700"
            },
            origin: {
                fields: ["Breed Group", "Origin"],
                gradient: "from-amber-500 via-orange-500 to-yellow-500",
                bg: "from-amber-50/80 to-orange-50/60",
                icon: "🌍",
                iconBg: "bg-amber-100",
                textColor: "text-amber-700"
            },
            health: {
                fields: ["Common Diseases"],
                gradient: "from-rose-500 via-pink-500 to-red-500",
                bg: "from-rose-50/80 to-pink-50/60",
                icon: "⚕️",
                iconBg: "bg-rose-100",
                textColor: "text-rose-700"
            }
        };

        for (const [key, config] of Object.entries(categories)) {
            if (config.fields.includes(title)) return config;
        }
        return categories.physical; // default
    };

    const InfoCard = ({ title, value, delay = 0 }) => {
        const style = getCardStyle(title);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay }}
                whileHover={{
                    y: -8,
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
                }}
                className="group relative"
            >
                {/* Gradient border with glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${style.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`} />
                <div className={`absolute inset-0 bg-gradient-to-r ${style.gradient} rounded-2xl p-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
                    <div className={`h-full w-full bg-gradient-to-br ${style.bg} backdrop-blur-sm rounded-2xl`} />
                </div>

                {/* Card content */}
                <div className="relative p-5 flex items-start gap-3">
                    {/* Icon with reveal animation */}
                    <motion.div
                        className={`${style.iconBg} rounded-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ delay: delay + 0.2, type: "spring" }}
                    >
                        <span className="text-2xl">{style.icon}</span>
                    </motion.div>

                    <div className="flex-1">
                        <h3 className={`text-xs font-bold ${style.textColor} uppercase tracking-wider mb-2`}>
                            {title}
                        </h3>
                        <p className="text-gray-800 font-semibold text-base leading-snug">
                            {value}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10" />

            {/* Animated Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-full blur-3xl -z-5"
            />

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-extrabold mb-2">🐕
                        <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Breed Information
                        </span>
                    </h1>
                    <p className="text-gray-600">Discover detailed information about any dog breed</p>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 mb-8 border border-white/50"
                >
                    <label className="block mb-4">
                        <span className="font-semibold text-gray-700">Breed Name</span>
                        <input
                            type="text"
                            value={breedName}
                            onChange={(e) => setBreedName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchBreedInfo(breedName)}
                            className="mt-2 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                            placeholder="Enter breed name (e.g. Labrador, Beagle)"
                        />
                    </label>


                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fetchBreedInfo(breedName)}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition relative overflow-hidden group"
                    >
                        <span className="relative z-10">🔍 Get Breed Info</span>
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        />
                    </motion.button>

                    {/* Loading */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center gap-3 mt-6 text-primary"
                        >
                            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="font-medium">Loading breed information...</span>
                        </motion.div>
                    )}

                    {/* Error – ONLY after search */}
                    {hasSearched && error && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4"
                        >
                            <p className="text-red-700 font-medium flex items-center gap-2">
                                <span>⚠️</span>
                                {error}
                            </p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Result */}
                {breedInfo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Breed Title Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-gradient-to-r from-primary to-indigo-700 text-white rounded-3xl shadow-2xl p-8 mb-8 border border-white/20"
                        >
                            <h2 className="text-4xl font-extrabold mb-2 capitalize">
                                {breedInfo.Breed || breedName}
                            </h2>
                            <p className="text-white/90 text-lg italic">
                                {breedInfo["Scientific Name"]}
                            </p>
                        </motion.div>

                        {/* Info Cards Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            <InfoCard title="Height" value={breedInfo.Height} delay={0.1} />
                            <InfoCard title="Weight" value={breedInfo.Weight} delay={0.12} />
                            <InfoCard title="Breed Group" value={breedInfo["Breed Group"]} delay={0.14} />
                            <InfoCard title="Origin" value={breedInfo.Origin} delay={0.16} />
                            <InfoCard title="Colors" value={breedInfo.Colors} delay={0.18} />
                            <InfoCard title="Coat Type" value={breedInfo["Coat Type"]} delay={0.2} />
                            <InfoCard title="Shedding Level" value={breedInfo["Shedding Level"]} delay={0.22} />
                            <InfoCard title="Temperament" value={breedInfo["Temperament Traits"]} delay={0.24} />
                            <InfoCard title="Intelligence" value={breedInfo["Intelligence Level"]} delay={0.26} />
                            <InfoCard title="Training Difficulty" value={breedInfo["Training Difficulty"]} delay={0.28} />
                            <InfoCard title="Exercise Needs" value={breedInfo["Exercise Needs"]} delay={0.3} />
                            <InfoCard title="Barking Level" value={breedInfo["Barking Level"]} delay={0.32} />
                            <InfoCard title="Grooming Needs" value={breedInfo["Grooming Requirements"]} delay={0.34} />
                            <InfoCard title="Common Diseases" value={breedInfo["Common Diseases"]} delay={0.36} />
                        </div>

                        {/* Long Description */}
                        {breedInfo["Long Description"] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                                className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-6 mb-8 shadow-lg"
                            >
                                <h3 className="font-bold text-xl mb-3 text-primary flex items-center gap-2">
                                    📚 About This Breed
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {breedInfo["Long Description"]}
                                </p>
                            </motion.div>
                        )}

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="flex flex-wrap gap-4"
                        >
                            <motion.button
                                onClick={() => navigate(`/diet/${breedName}`)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 min-w-[200px] px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                            >
                                🥗 View Diet Plan
                            </motion.button>

                            <motion.button
                                onClick={() => navigate('/predict')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-secondary to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                            >
                                🔍 Analyze Another Breed
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}