"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

interface HistoryRecord {
    id: number;
    user: { firstName: string; lastName: string; email: string };
    action: string;
    timestamp: string;
    details: string;
}

interface PageResponse {
    content: HistoryRecord[];
    totalPages: number;
    totalElements: number;
    number: number;
}

const ACTION_LABELS: Record<string, string> = {
    BOOK_ISSUED: "Book Issued",
    BOOK_RETURNED: "Book Returned",
};

const ACTION_COLORS: Record<string, string> = {
    BOOK_ISSUED: "bg-blue-100 text-blue-800",
    BOOK_RETURNED: "bg-green-100 text-green-800",
};

export default function AdminHistoryPage() {
    const [data, setData] = useState<PageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);

    const loadHistory = async (pageNum: number) => {
        setLoading(true);
        try {
            const result = await fetchApi(`/history?page=${pageNum}&size=20`);
            setData(result as PageResponse);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory(page);
    }, [page]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Operation History</h1>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : !data || data.content.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-gray-200">
                    No records found.
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Timestamp</th>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Performed by</th>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Action</th>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.content.map((h) => (
                                    <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(h.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {h.user.firstName} {h.user.lastName}
                                            <div className="text-xs text-gray-400">{h.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    ACTION_COLORS[h.action] ?? "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {ACTION_LABELS[h.action] ?? h.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{h.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {data.totalPages > 1 && (
                        <div className="flex justify-between items-center">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm disabled:opacity-40 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {data.number + 1} of {data.totalPages} ({data.totalElements} records)
                            </span>
                            <button
                                disabled={page >= data.totalPages - 1}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm disabled:opacity-40 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
