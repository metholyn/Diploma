"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function AdminBorrowsPage() {
    const [activeBorrows, setActiveBorrows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [issueForm, setIssueForm] = useState({ bookId: "", userCardId: "", daysToBorrow: 14 });

    const loadBorrows = async () => {
        try {
            const data = await fetchApi("/borrow/active");
            setActiveBorrows(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBorrows();
    }, []);

    const handleIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchApi("/borrow/issue", {
                method: "POST",
                body: JSON.stringify({
                    bookId: parseInt(issueForm.bookId),
                    userCardId: parseInt(issueForm.userCardId),
                    daysToBorrow: issueForm.daysToBorrow
                })
            });
            setIssueForm({ bookId: "", userCardId: "", daysToBorrow: 14 });
            loadBorrows();
        } catch (error: any) {
            alert("Error issuing book: " + error.message);
        }
    };

    const handleReturn = async (recordId: number) => {
        try {
            await fetchApi(`/borrow/return/${recordId}`, { method: "POST" });
            loadBorrows();
        } catch (error: any) {
            alert("Error returning book: " + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Borrowings</h1>

            <form onSubmit={handleIssue} className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                <h3 className="font-semibold text-lg mb-4">Issue Book</h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Book ID</label>
                        <input type="number" required className="border p-2 rounded w-full"
                            value={issueForm.bookId} onChange={e => setIssueForm({ ...issueForm, bookId: e.target.value })} />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">User Card ID</label>
                        <input type="number" required className="border p-2 rounded w-full"
                            value={issueForm.userCardId} onChange={e => setIssueForm({ ...issueForm, userCardId: e.target.value })} />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Days</label>
                        <input type="number" required className="border p-2 rounded w-full"
                            value={issueForm.daysToBorrow} onChange={e => setIssueForm({ ...issueForm, daysToBorrow: parseInt(e.target.value) })} />
                    </div>
                    <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 h-10">Issue</button>
                </div>
            </form>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <h3 className="font-semibold text-lg px-6 py-4 border-b bg-gray-50">Active Borrowings</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-white">
                            <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Book Title</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">User Card</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Expected Return</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeBorrows.map(b => (
                            <tr key={b.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-sm">{b.id}</td>
                                <td className="p-4 text-sm">{b.book?.title}</td>
                                <td className="p-4 text-sm">{b.userCard?.cardNumber}</td>
                                <td className="p-4 text-sm">{b.expectedReturnDate}</td>
                                <td className="p-4 text-sm">
                                    <button onClick={() => handleReturn(b.id)} className="text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-50 transition">
                                        Return Item
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {activeBorrows.length === 0 && (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500">No active borrowings found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
