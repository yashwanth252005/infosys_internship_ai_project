// frontend/src/components/ui/Buttons.jsx
import { motion } from "framer-motion";

export default function Button({ children, ...props }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-xl bg-primary text-white shadow-soft hover:opacity-90"
            {...props}
        >
            {children}
        </motion.button>
    );
}