// frontend/src/pages/Predict.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const DIET_TABS = ["puppy", "adult", "senior"];

export default function Predict() {
    const navigate = useNavigate();

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const [breedInfo, setBreedInfo] = useState(null);
    const [dietTab, setDietTab] = useState("adult");
    const [dietInfo, setDietInfo] = useState(null);
    const [pregnantDiet, setPregnantDiet] = useState(null);

    const [dietData, setDietData] = useState(null);
    const [dietStage, setDietStage] = useState("adult");
    const [dietLoading, setDietLoading] = useState(false);

    const dropRef = useRef(null);

    const breed =
        result?.is_dog && result?.predictions?.[0]?.breed;

    /* ---------- Image Handler ---------- */
    const handleImage = (file) => {
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file");
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setResult(null);
        setBreedInfo(null);
        setDietInfo(null);
        setPregnantDiet(null);
    };

    /* ---------- Drag & Drop ---------- */
    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            handleImage(e.dataTransfer.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    /* ---------- Paste ---------- */
    useEffect(() => {
        const handlePaste = (e) => {
            const item = [...e.clipboardData.items].find(i =>
                i.type.startsWith("image/")
            );
            if (item) handleImage(item.getAsFile());
        };
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, []);

    useEffect(() => {
        if (!breed) return;

        const fetchDiet = async () => {
            try {
                setDietLoading(true);
                const res = await api.get(`/api/data/diet/${breed}`);
                setDietData(res.data);
            } catch (err) {
                console.error("Diet fetch failed");
                setDietData(null);
            } finally {
                setDietLoading(false);
            }
        };

        fetchDiet();
    }, [breed]);

    /* ---------- Predict ---------- */
    const handlePredict = async () => {
        if (!imageFile) {
            toast.error("Upload a dog image first 🐕");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", imageFile);

            const res = await api.post("/api/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(res.data);
        } catch (err) {
            console.error("Prediction error:", err);
            toast.error(err.response?.data?.detail || "Prediction failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Fetch Breed & Diet ---------- */
    useEffect(() => {
        if (!breed) return;

        api.get(`/api/data/breed/${breed}`)
            .then(res => setBreedInfo(res.data.data))
            .catch(() => { });

        api.get(`/api/data/diet/${breed}/${dietTab}`)
            .then(res => setDietInfo(res.data.data))
            .catch(() => { });

        api.get(`/api/data/diet/${breed}/pregnant`)
            .then(res => setPregnantDiet(res.data.data))
            .catch(() => { });
    }, [breed, dietTab]);

    return (
        <div className="relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10" />

            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-4xl font-extrabold mb-8">
                    AI Dog Breed Analyzer 🧬
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ================= LEFT: Upload ================= */}
                    <motion.div
                        ref={dropRef}
                        onDrop={handleDrop}
                        onDragOver={handleDrag}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`rounded-3xl border-2 border-dashed p-8 transition shadow-lg
                        ${dragActive
                                ? "border-indigo-500 bg-indigo-50 scale-105"
                                : "border-gray-300 bg-white/80 backdrop-blur-sm"
                            }`}
                    >
                        <label className="cursor-pointer text-center block">
                            <p className="font-semibold mb-2">
                                Drag & drop, paste, or click to upload
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                JPG / PNG images supported
                            </p>

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImage(e.target.files[0])}
                            />

                            <span className="inline-block px-6 py-2 bg-primary text-white rounded-xl shadow hover:scale-105 transition">
                                Choose Image
                            </span>
                        </label>

                        {imagePreview && (
                            <motion.img
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                src={imagePreview}
                                alt="Preview"
                                className="mt-6 rounded-xl border-2 border-gray-200 max-h-96 mx-auto shadow-md"
                            />
                        )}

                        <motion.button
                            onClick={handlePredict}
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : (
                                "Analyze Breed"
                            )}
                        </motion.button>
                    </motion.div>

                    {/* ================= RIGHT: DASHBOARD ================= */}
                    <div className="space-y-6">

                        {!result && (
                            <div className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl p-8 text-center text-gray-500">
                                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-6xl">🐾</span>
                                </div>
                                <p className="text-lg font-semibold">Upload an image to see AI insights</p>
                            </div>
                        )}

                        {result && !result.is_dog && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 shadow-xl p-8 text-center"
                            >
                                <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-5xl">⚠️</span>
                                </div>
                                <h3 className="text-2xl font-bold text-red-700 mb-3">
                                    No Dog Detected
                                </h3>
                                <p className="text-red-600 font-medium text-lg">
                                    {result.message || "It has been detected that the uploaded image is not a dog. Please upload a valid dog image."}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setResult(null);
                                        setImagePreview(null);
                                        setImageFile(null);
                                    }}
                                    className="mt-6 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                                >
                                    Try Another Image
                                </motion.button>
                            </motion.div>
                        )}

                        {breed && (
                            <>
                                {/* ---------- Essential Info ---------- */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="rounded-3xl bg-gradient-to-br from-primary to-indigo-700 text-white p-8 shadow-2xl border border-white/20"
                                >
                                    <h2 className="text-3xl font-bold capitalize mb-2">
                                        {breed.replace("_", " ")}
                                    </h2>
                                    <p className="text-green-200 font-medium mb-6">
                                        ✅ AI-verified breed match
                                    </p>

                                    {breedInfo && (
                                        <div className="grid sm:grid-cols-2 gap-4 text-sm bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                                            <div className="flex items-start gap-2">
                                                <span>🐕</span>
                                                <span><strong>Group:</strong> {breedInfo["Breed Group"]}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span>📏</span>
                                                <span><strong>Size:</strong> {breedInfo.Height} / {breedInfo.Weight}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span>🏃</span>
                                                <span><strong>Exercise:</strong> {breedInfo["Exercise Needs"]}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span>🧠</span>
                                                <span><strong>Temperament:</strong> {breedInfo["Temperament Traits"]}</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                {/* ================= TODAY'S DIET ================= */}
                                <div className="mt-8">
                                    <h3 className="text-2xl font-bold mb-4">
                                        🍽️ Today’s Diet Plan
                                    </h3>

                                    {/* Life Stage Tabs */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {["puppy", "adult", "senior", "pregnant/nursing"].map(stage => (
                                            <button
                                                key={stage}
                                                onClick={() => setDietStage(stage)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition
                                                ${dietStage === stage
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {stage === "pregnant/nursing" ? "Pregnant/Nursing" : stage.charAt(0).toUpperCase() + stage.slice(1)}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Diet Content */}
                                    {dietLoading && (
                                        <p className="text-gray-500">Loading diet...</p>
                                    )}

                                    {!dietLoading && dietData && (
                                        <>
                                            {dietData.diet?.[dietStage] && (
                                                <div className={`rounded-2xl p-6 shadow-lg ${dietStage === "pregnant/nursing"
                                                    ? "bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300"
                                                    : "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300"
                                                    }`}>
                                                    <p className={`text-lg font-bold mb-3 ${dietStage === "pregnant/nursing" ? "text-pink-700" : "text-green-700"
                                                        }`}>
                                                        {dietStage === "pregnant/nursing" ? "🤰 Pregnant/Nursing Diet Plan" : `🍽️ ${dietStage.charAt(0).toUpperCase() + dietStage.slice(1)} Diet for Today`}
                                                    </p>
                                                    <p className="text-gray-800 leading-relaxed">
                                                        {
                                                            // Check if it's a day-wise diet or single string
                                                            typeof dietData.diet[dietStage] === "object" && dietData.diet[dietStage].diet
                                                                ? dietData.diet[dietStage].diet // pregnant/nursing with {diet: "..."}
                                                                : typeof dietData.diet[dietStage] === "object"
                                                                    ? dietData.diet[dietStage][
                                                                    new Date()
                                                                        .toLocaleDateString("en-US", { weekday: "long" })
                                                                        .toLowerCase()
                                                                    ] || "No diet plan available for today"
                                                                    : dietData.diet[dietStage] // direct string
                                                        }
                                                    </p>
                                                    {dietStage === "pregnant/nursing" && (
                                                        <div className="mt-4 p-3 bg-white/60 rounded-xl border border-pink-200">
                                                            <p className="text-sm text-pink-800 font-medium">
                                                                💡 <strong>Important:</strong> Pregnant and nursing dogs have special nutritional needs. Consult your vet for personalized guidance.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}

                                </div>

                                {/* ================= NAVIGATION BUTTONS ================= */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="flex flex-wrap gap-4"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate(`/breed/${breed}`)}
                                        className="flex-1 min-w-[200px] px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition"
                                    >
                                        📖 View Full Info
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate(`/diet/${breed}`)}
                                        className="flex-1 min-w-[200px] px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
                                    >
                                        🥗 View Full Diet Plan
                                    </motion.button>
                                </motion.div>

                                {/* ---------- About Breed ---------- */}
                                {breedInfo && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 }}
                                        className="rounded-3xl bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm shadow-xl p-6 border border-white/50"
                                    >
                                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                            📚 About This Breed
                                        </h3>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {breedInfo["Long Description"]}
                                        </p>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}