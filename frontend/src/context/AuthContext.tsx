"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    username: string; // From backend's JwtResponse it seems to be email or username
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if token and user data exist in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials: any) => {
        const data = await fetchApi("/auth/signin", {
            method: "POST",
            body: JSON.stringify(credentials),
        });

        // Store token
        localStorage.setItem("token", data.jwt || data.token || data.accessToken);

        // Store user info
        const userData = {
            id: data.id,
            username: data.username,
            roles: data.roles,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        router.push("/");
    };

    const register = async (data: any) => {
        await fetchApi("/auth/signup", {
            method: "POST",
            body: JSON.stringify(data),
        });
        // Redirect to login after successful registration
        router.push("/login");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
