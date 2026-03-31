"use client";

import { useEffect } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
}

export default function Toast({ message, type = "info", onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-blue-600",
    };

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-white text-sm ${colors[type]}`}
        >
            <span>{message}</span>
            <button
                onClick={onClose}
                className="ml-2 text-white/80 hover:text-white font-bold text-lg leading-none"
            >
                &times;
            </button>
        </div>
    );
}
