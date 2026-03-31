"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import Toast from "@/components/Toast";

interface UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    enabled: boolean;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const loadUsers = async () => {
        try {
            const data = await fetchApi("/users");
            setUsers(data as UserDto[]);
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
            setToast({ message: "Library card created successfully!", type: "success" });
            loadUsers();
        } catch (error: unknown) {
            setToast({
                message: "Failed: " + (error instanceof Error ? error.message : String(error)),
                type: "error",
            });
        }
    };

    const handleToggleStatus = async (userId: number, currentlyEnabled: boolean) => {
        const action = currentlyEnabled ? "block" : "unblock";
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;
        try {
            await fetchApi(`/users/${userId}/status?enabled=${!currentlyEnabled}`, {
                method: "PATCH",
            });
            setToast({
                message: `User ${action}ed successfully.`,
                type: "success",
            });
            loadUsers();
        } catch (error: unknown) {
            setToast({
                message: "Failed: " + (error instanceof Error ? error.message : String(error)),
                type: "error",
            });
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Role</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm text-gray-800">{u.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{u.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {u.firstName} {u.lastName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            u.enabled !== false
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {u.enabled !== false ? "Active" : "Blocked"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm flex gap-4">
                                    <button
                                        onClick={() => handleCreateCard(u.id)}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Create Card
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(u.id, u.enabled !== false)}
                                        className={`font-medium ${
                                            u.enabled !== false
                                                ? "text-red-600 hover:text-red-800"
                                                : "text-green-600 hover:text-green-800"
                                        }`}
                                    >
                                        {u.enabled !== false ? "Block" : "Unblock"}
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
