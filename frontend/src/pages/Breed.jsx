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

    const InfoCard = ({ title, value, delay = 0 }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 hover:shadow-xl transition border border-white/50"
        >
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
            <p className="mt-2 text-gray-800 font-semibold text-base">{value}</p>
        </motion.div>
    );

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
                    <h1 className="text-4xl font-extrabold mb-2">🐕 Breed Information</h1>
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
                        onClick={() => fetchBreedInfo(breedName)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3 bg-gradient-to-r from-primary to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                        🔍 Get Breed Info
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