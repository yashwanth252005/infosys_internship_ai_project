// frontend/src/pages/Diet.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";

export default function Diet() {
    const { breed_name } = useParams();
    const navigate = useNavigate();

    const [breedName, setBreedName] = useState(breed_name);
    const [lifeStage, setLifeStage] = useState("");
    const [dietData, setDietData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchDietPlan = async () => {
        if (!breedName) return;

        try {
            setLoading(true);
            setError("");
            setDietData(null);

            const url = lifeStage
                ? `/api/data/diet/${breedName}/${lifeStage}`
                : `/api/data/diet/${breedName}`;

            const res = await api.get(url);
            setDietData(res.data);
        } catch (err) {
            console.error(err);
            setError("Diet plan not found for this breed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDietPlan();
        // eslint-disable-next-line
    }, []);

    const dayEmojis = {
        monday: '🍖',
        tuesday: '🥩',
        wednesday: '🍗',
        thursday: '🥘',
        friday: '🍲',
        saturday: '🥗',
        sunday: '🍱'
    };

    const dayColors = {
        monday: {
            gradient: 'from-rose-400 via-pink-500 to-red-500',
            bg: 'from-rose-50/90 to-pink-50/70',
            border: 'from-rose-500 via-pink-500 to-red-500',
            text: 'text-rose-700'
        },
        tuesday: {
            gradient: 'from-orange-400 via-amber-500 to-yellow-500',
            bg: 'from-orange-50/90 to-amber-50/70',
            border: 'from-orange-500 via-amber-500 to-yellow-500',
            text: 'text-orange-700'
        },
        wednesday: {
            gradient: 'from-green-400 via-emerald-500 to-teal-500',
            bg: 'from-green-50/90 to-emerald-50/70',
            border: 'from-green-500 via-emerald-500 to-teal-500',
            text: 'text-green-700'
        },
        thursday: {
            gradient: 'from-blue-400 via-cyan-500 to-sky-500',
            bg: 'from-blue-50/90 to-cyan-50/70',
            border: 'from-blue-500 via-cyan-500 to-sky-500',
            text: 'text-blue-700'
        },
        friday: {
            gradient: 'from-indigo-400 via-purple-500 to-violet-500',
            bg: 'from-indigo-50/90 to-purple-50/70',
            border: 'from-indigo-500 via-purple-500 to-violet-500',
            text: 'text-indigo-700'
        },
        saturday: {
            gradient: 'from-purple-400 via-fuchsia-500 to-pink-500',
            bg: 'from-purple-50/90 to-fuchsia-50/70',
            border: 'from-purple-500 via-fuchsia-500 to-pink-500',
            text: 'text-purple-700'
        },
        sunday: {
            gradient: 'from-amber-400 via-orange-500 to-rose-500',
            bg: 'from-amber-50/90 to-orange-50/70',
            border: 'from-amber-500 via-orange-500 to-rose-500',
            text: 'text-amber-700'
        }
    };

    const stageColors = {
        puppy: 'from-yellow-400 to-orange-500',
        adult: 'from-green-400 to-emerald-600',
        senior: 'from-purple-400 to-indigo-600',
        pregnant: 'from-pink-400 to-rose-600'
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
                    <h1 className="text-4xl font-extrabold mb-2">
                        🍽️
                        <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Diet Plan</span>
                    </h1>
                    <p className="text-gray-600">Personalized nutrition plans for your dog's life stage</p>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 mb-8 border border-white/50"
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Breed Name */}
                        <label className="block">
                            <span className="font-semibold text-gray-700 flex items-center gap-2">
                                🐕 Breed Name
                            </span>
                            <input
                                type="text"
                                value={breedName}
                                onChange={(e) => setBreedName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchDietPlan()}
                                className="mt-2 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                placeholder="Enter breed name (e.g. Labrador)"
                                required
                            />
                        </label>

                        {/* Life Stage */}
                        <label className="block">
                            <span className="font-semibold text-gray-700 flex items-center gap-2">
                                📅 Life Stage
                            </span>
                            <select
                                value={lifeStage}
                                onChange={(e) => setLifeStage(e.target.value)}
                                className="mt-2 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white"
                            >
                                <option value="">All Stages</option>
                                <option value="puppy">🐶 Puppy</option>
                                <option value="adult">🐕 Adult</option>
                                <option value="senior">🦮 Senior</option>
                                <option value="pregnant">🤰 Pregnant / Nursing</option>
                            </select>
                        </label>
                    </div>

                    {/* Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchDietPlan}
                        className="mt-6 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition relative overflow-hidden group"
                    >
                        <span className="relative z-10">🔍 Get Diet Plan</span>
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
                            <span className="font-medium">Loading diet plan...</span>
                        </motion.div>
                    )}

                    {/* Error */}
                    {error && (
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

                {/* Diet Output */}
                {dietData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        {dietData.diet ? (
                            // Multiple stages
                            Object.entries(dietData.diet).map(([stage, days], stageIndex) => (
                                <motion.div
                                    key={stage}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: stageIndex * 0.1 }}
                                >
                                    {/* Stage Header */}
                                    <div className={`bg-gradient-to-r ${stageColors[stage] || 'from-blue-400 to-cyan-600'} text-white rounded-3xl p-6 mb-6 shadow-xl`}>
                                        <h2 className="text-3xl font-extrabold capitalize flex items-center gap-3">
                                            {stage === 'puppy' && '🐶'}
                                            {stage === 'adult' && '🐕'}
                                            {stage === 'senior' && '🦮'}
                                            {stage === 'pregnant' && '🤰'}
                                            {stage} Diet Plan
                                        </h2>
                                        <p className="text-white/90 mt-2">Weekly nutrition schedule</p>
                                    </div>

                                    {/* Daily Cards */}
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {Object.entries(days).map(([day, food], dayIndex) => {
                                            const colors = dayColors[day] || dayColors.monday;
                                            return (
                                                <motion.div
                                                    key={day}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3, delay: dayIndex * 0.05 }}
                                                    whileHover={{
                                                        y: -10,
                                                        scale: 1.03,
                                                        boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
                                                    }}
                                                    className="group relative"
                                                >
                                                    {/* Gradient glow effect */}
                                                    <div className={`absolute inset-0 bg-gradient-to-r ${colors.border} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`} />

                                                    {/* Gradient border */}
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.border} rounded-2xl p-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-300`}>
                                                        <div className={`h-full w-full bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-2xl`} />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="relative p-6">
                                                        {/* Day header with animated icon */}
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h3 className={`font-bold text-xl capitalize ${colors.text} tracking-wide`}>
                                                                {day}
                                                            </h3>
                                                            <motion.span
                                                                className="text-4xl"
                                                                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                                                transition={{ duration: 0.5 }}
                                                            >
                                                                {dayEmojis[day]}
                                                            </motion.span>
                                                        </div>

                                                        {/* Decorative divider */}
                                                        <div className={`h-1 w-16 bg-gradient-to-r ${colors.gradient} rounded-full mb-4 group-hover:w-full transition-all duration-300`} />

                                                        {/* Food description */}
                                                        <p className="text-gray-700 text-base leading-relaxed font-medium">
                                                            {food}
                                                        </p>

                                                        {/* Utensils icon (appears on hover) */}
                                                        <motion.div
                                                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                                            initial={{ rotate: -15 }}
                                                        >
                                                            <span className="text-6xl">🍴</span>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            // Single stage or simple view
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-3xl p-6 mb-6 shadow-xl">
                                    <h2 className="text-3xl font-extrabold flex items-center gap-3">
                                        🥗 Diet Plan for {breedName}
                                    </h2>
                                    <p className="text-white/90 mt-2">Weekly nutrition schedule</p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {Object.entries(dietData).map(([day, food], index) => {
                                        const colors = dayColors[day] || dayColors.monday;
                                        return (
                                            <motion.div
                                                key={day}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                whileHover={{
                                                    y: -10,
                                                    scale: 1.03,
                                                    boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
                                                }}
                                                className="group relative"
                                            >
                                                {/* Gradient glow effect */}
                                                <div className={`absolute inset-0 bg-gradient-to-r ${colors.border} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`} />

                                                {/* Gradient border */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.border} rounded-2xl p-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-300`}>
                                                    <div className={`h-full w-full bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-2xl`} />
                                                </div>

                                                {/* Content */}
                                                <div className="relative p-6">
                                                    {/* Day header with animated icon */}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className={`font-bold text-xl capitalize ${colors.text} tracking-wide`}>
                                                            {day}
                                                        </h3>
                                                        <motion.span
                                                            className="text-4xl"
                                                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            {dayEmojis[day]}
                                                        </motion.span>
                                                    </div>

                                                    {/* Decorative divider */}
                                                    <div className={`h-1 w-16 bg-gradient-to-r ${colors.gradient} rounded-full mb-4 group-hover:w-full transition-all duration-300`} />

                                                    {/* Food description */}
                                                    <p className="text-gray-700 text-base leading-relaxed font-medium">
                                                        {food}
                                                    </p>

                                                    {/* Utensils icon (appears on hover) */}
                                                    <motion.div
                                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                                        initial={{ rotate: -15 }}
                                                    >
                                                        <span className="text-6xl">🍴</span>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="flex flex-wrap gap-4 pt-6"
                        >
                            <motion.button
                                onClick={() => navigate(`/breed/${breedName}`)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 min-w-[200px] px-8 py-4 bg-gradient-to-r from-secondary to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                            >
                                📖 View Breed Info
                            </motion.button>

                            <motion.button
                                onClick={() => navigate('/predict')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-primary to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                            >
                                🧬 Analyze Another Breed
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}