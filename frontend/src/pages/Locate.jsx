// frontend/src/pages/Locate.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const SERVICES = [
    {
        id: "vet",
        name: "Veterinary Clinics",
        icon: "🏥",
        query: "veterinary clinic",
    },
    {
        id: "store",
        name: "Pet Stores",
        icon: "🛒",
        query: "pet store",
    },
    {
        id: "grooming",
        name: "Pet Grooming",
        icon: "✂️",
        query: "pet grooming",
    },
];

export default function Locate() {
    const [location, setLocation] = useState("");
    const [manualLocation, setManualLocation] = useState("");
    const [selectedService, setSelectedService] = useState("all");
    const [loadingLocation, setLoadingLocation] = useState(true);

    /* ===============================
       Detect User Location on Load
    =============================== */
    useEffect(() => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported by your browser");
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Reverse lookup via OpenStreetMap (FREE)
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();

                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.state;

                    const country = data.address.country || "";

                    const detectedLocation = `${city}, ${country}`;
                    setLocation(detectedLocation);
                    setManualLocation(detectedLocation);
                } catch (err) {
                    toast.error("Unable to detect location");
                } finally {
                    setLoadingLocation(false);
                }
            },
            () => {
                toast.error("Location permission denied");
                setLoadingLocation(false);
            }
        );
    }, []);

    /* ===============================
       Google Maps Redirect
    =============================== */
    const openMaps = (query) => {
        if (!manualLocation) {
            toast.error("Please enter a location");
            return;
        }

        const url = `https://www.google.com/maps/search/${encodeURIComponent(
            `${query} near ${manualLocation}`
        )}`;

        window.open(url, "_blank");
    };

    const visibleServices =
        selectedService === "all"
            ? SERVICES
            : SERVICES.filter((s) => s.id === selectedService);

    return (
        <div className="relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10" />

            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* ================= HEADER ================= */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-extrabold mb-2">
                        📍 Pet Services Near You
                    </h1>

                    <p className="text-gray-600">
                        {loadingLocation
                            ? "Detecting your location..."
                            : location
                                ? `Services near ${location} (~10 km radius)`
                                : "Search pet services by location"}
                    </p>
                </motion.div>

                {/* ================= SEARCH BAR ================= */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Location Input */}
                        <input
                            type="text"
                            value={manualLocation}
                            onChange={(e) => setManualLocation(e.target.value)}
                            placeholder="Enter area or city (e.g., Bangalore)"
                            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        />

                        {/* Service Filter */}
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="all">All Services</option>
                            <option value="vet">Veterinary Clinics</option>
                            <option value="store">Pet Stores</option>
                            <option value="grooming">Pet Grooming</option>
                        </select>

                        {/* Search Button */}
                        <button
                            onClick={() => openMaps("pet services")}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
                        >
                            🔍 Search
                        </button>
                    </div>
                </div>

                {/* ================= SERVICES GRID ================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleServices.map((service) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-6 transition"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <span className="text-2xl">{service.icon}</span>
                                    {service.name}
                                </h3>
                            </div>

                            <p className="text-gray-600 text-sm mb-6">
                                Find trusted {service.name.toLowerCase()} near{" "}
                                {manualLocation || "your location"}.
                            </p>

                            <button
                                onClick={() => openMaps(service.query)}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-400 to-orange-400 text-white font-semibold shadow hover:shadow-lg transition"
                            >
                                🧭 Get Directions
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}