// frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data?.session?.user ?? null);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // ✅ REGISTER (NO Mongo sync here)
    const signUp = async (email, password) => {
        return await supabase.auth.signUp({
            email,
            password,
        });
    };

    // ✅ LOGIN (Mongo sync ONLY here)
    const signIn = async (email, password) => {
        const res = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (res.data?.user) {
            await api.post("/api/users/sync", {
                email: res.data.user.email,
                supabase_id: res.data.user.id,
            });
        }

        return res;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}