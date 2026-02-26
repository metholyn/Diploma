"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || (!user.roles.includes("ROLE_ADMIN") && !user.roles.includes("ROLE_LIBRARIAN")))) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="flex min-h-[calc(100vh-120px)] bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <aside className="w-64 bg-gray-50 border-r border-gray-200 p-6 flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>
                <Link href="/admin" className="px-4 py-2 hover:bg-white rounded-md transition text-gray-700 font-medium">Dashboard</Link>
                <Link href="/admin/users" className="px-4 py-2 hover:bg-white rounded-md transition text-gray-700 font-medium">Manage Users</Link>
                <Link href="/admin/books" className="px-4 py-2 hover:bg-white rounded-md transition text-gray-700 font-medium">Manage Books</Link>
                <Link href="/admin/borrows" className="px-4 py-2 hover:bg-white rounded-md transition text-gray-700 font-medium">Borrowings</Link>
            </aside>
            <main className="flex-1 p-8 bg-white">
                {children}
            </main>
        </div>
    );
}
