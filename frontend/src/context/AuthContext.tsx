"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    username: string; // From backend's JwtResponse it seems to be email or username
    roles: string[];
}

interface Credentials {
    email: string;
    password: string;
}

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: Credentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser) as User);
        }
        setLoading(false);
    }, []);
    const router = useRouter();

    const login = async (credentials: Credentials) => {
        const raw = await fetchApi("/auth/signin", {
            method: "POST",
            body: JSON.stringify(credentials),
        });

        const data = raw as { jwt?: string; token?: string; accessToken?: string; id: number; username: string; roles: string[] };

        // Store token
        localStorage.setItem("token", data.jwt ?? data.token ?? data.accessToken ?? "");

        // Store user info
        const userData: User = {
            id: data.id,
            username: data.username,
            roles: data.roles,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        router.push("/");
    };

    const register = async (data: RegisterData) => {
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
