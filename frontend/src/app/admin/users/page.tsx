"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            const data = await fetchApi("/users");
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreateCard = async (userId: number) => {
        try {
            await fetchApi(`/users/${userId}/card`, { method: "POST" });
            alert("Card created successfully!");
            loadUsers(); // refresh data
        } catch (error: any) {
            alert("Failed to create card: " + error.message);
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Role</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm text-gray-800">{u.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{u.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{u.firstName} {u.lastName}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{u.role}</span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => handleCreateCard(u.id)}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Create Card
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
