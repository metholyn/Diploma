"use client";

import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <p className="text-gray-600 mb-8">
                Welcome to the Admin Panel, {user?.username}.
                You have {user?.roles.join(", ")} permissions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Users Management</h3>
                    <p className="text-blue-700 text-sm">Create user cards, manage reader access.</p>
                </div>
                <div className="bg-green-50 border border-green-100 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Book Catalog</h3>
                    <p className="text-green-700 text-sm">Add new books, update copies, remove old ones.</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Borrowings</h3>
                    <p className="text-purple-700 text-sm">Issue books to readers and handle returns.</p>
                </div>
            </div>
        </div>
    );
}
