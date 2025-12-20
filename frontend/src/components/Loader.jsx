// frontend/src/components/Loader.jsx
import { motion } from "framer-motion";

export default function Loader({ text = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
            />
            <p className="mt-4 text-gray-600">{text}</p>
        </div>
    );
}