// frontend/src/components/Navbar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
    const { user, signOut } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const baseLink =
        "px-3 py-2 rounded-xl text-sm font-medium transition";

    const activeLink =
        "bg-white/90 text-indigo-700 shadow";

    const inactiveLink =
        "text-white/90 hover:text-white hover:bg-white/10";

    return (
        <>
            <motion.nav
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <NavLink
                        to="/"
                        onClick={() => setMobileOpen(false)}
                        className="text-2xl font-extrabold text-white flex items-center gap-2"
                    >
                        🐶 DogAI
                    </NavLink>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {[
                            { to: "/", label: "Home" },
                            { to: "/predict", label: "Predict" },
                            { to: "/breed", label: "Breeds" },
                            { to: "/diet", label: "Diet" },
                            { to: "/chat", label: "Chatbot" },
                            { to: "/shop", label: "Shop" },
                            { to: "/locate", label: "Services" }
                        ].map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `${baseLink} ${isActive ? activeLink : inactiveLink}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        {user && (
                            <>
                                <NavLink
                                    to="/orders"
                                    className={({ isActive }) =>
                                        `${baseLink} ${isActive ? activeLink : inactiveLink}`
                                    }
                                >
                                    Orders
                                </NavLink>
                                <NavLink
                                    to="/cart"
                                    className={({ isActive }) =>
                                        `${baseLink} ${isActive ? activeLink : inactiveLink}`
                                    }
                                >
                                    Cart
                                </NavLink>

                            </>
                        )}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <div className="hidden md:flex items-center gap-3">
                                <NavLink
                                    to="/login"
                                    className="text-white/90 hover:text-white text-sm font-medium"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-semibold shadow hover:scale-105 transition"
                                >
                                    Register
                                </NavLink>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center text-white font-bold uppercase shadow">
                                    {user.email?.charAt(0)}
                                </div>

                                <button
                                    onClick={signOut}
                                    className="text-sm text-white/90 hover:text-white hover:underline"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden text-2xl text-white"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg"
                >
                    <div className="flex flex-col px-6 py-6 gap-4">
                        {[
                            "/", "/predict", "/breed", "/diet", "/chat", "/shop", "/locate"
                        ].map((path) => (
                            <NavLink
                                key={path}
                                to={path}
                                onClick={() => setMobileOpen(false)}
                                className="font-medium hover:underline"
                            >
                                {path === "/" ? "HOME" : path.replace("/", "").toUpperCase()}
                            </NavLink>
                        ))}

                        {user && (
                            <>
                                <NavLink to="/orders" onClick={() => setMobileOpen(false)}>
                                    Orders
                                </NavLink>
                                <NavLink to="/cart" onClick={() => setMobileOpen(false)}>
                                    Cart
                                </NavLink>
                                <NavLink to="/locate" onClick={() => setMobileOpen(false)}>
                                    Services
                                </NavLink>
                            </>
                        )}

                        <hr className="border-white/30" />

                        {!user ? (
                            <>
                                <NavLink to="/login" onClick={() => setMobileOpen(false)}>
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="font-semibold underline"
                                >
                                    Register
                                </NavLink>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    signOut();
                                    setMobileOpen(false);
                                }}
                                className="text-left text-red-200 hover:text-red-100"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </>
    );
}