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
        // monday: '🌙',
        // tuesday: '🔥',
        // wednesday: '💧',
        // thursday: '⚡',
        // friday: '🌟',
        // saturday: '🌈',
        // sunday: '☀️'
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
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

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-extrabold mb-2">🍽️ Diet Plan</h1>
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
                        onClick={fetchDietPlan}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6 px-8 py-3 bg-gradient-to-r from-primary to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        🔍 Get Diet Plan
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
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(days).map(([day, food], dayIndex) => (
                                            <motion.div
                                                key={day}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: dayIndex * 0.05 }}
                                                whileHover={{ y: -8, scale: 1.02 }}
                                                className="bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl p-5 border border-white/50 transition"
                                            >
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-3xl">{dayEmojis[day] || '📅'}</span>
                                                    <h3 className="font-bold text-lg capitalize text-gray-800">
                                                        {day}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-700 text-lg leading-relaxed">
                                                    {food}
                                                </p>
                                            </motion.div>
                                        ))}
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

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(dietData).map(([day, food], index) => (
                                        <motion.div
                                            key={day}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            className="bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl p-5 border border-white/50 transition"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-3xl">{dayEmojis[day] || '📅'}</span>
                                                <h3 className="font-bold text-lg capitalize text-gray-800">
                                                    {day}
                                                </h3>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {food}
                                            </p>
                                        </motion.div>
                                    ))}
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