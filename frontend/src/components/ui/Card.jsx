// frontend/src/components/ui/Card.jsx
import { motion } from "framer-motion";

export default function Card({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-card p-5"
        >
            {children}
        </motion.div>
    );
}