"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    totalCopies: number;
    availableCopies: number;
    category?: string;
}

interface PageResponse {
    content: Book[];
    totalPages: number;
    totalElements: number;
    number: number;
}

export default function CatalogPage() {
    const [data, setData] = useState<PageResponse | null>(null);
    const [query, setQuery] = useState("");
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadBooks = useCallback(async (q: string, avail: boolean, p: number) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(p), size: "12" });
            if (q) params.set("query", q);
            if (avail) params.set("available", "true");
            const result = await fetchApi(`/books?${params.toString()}`);
            setData(result as PageResponse);
        } catch (error) {
            console.error("Failed to load books", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBooks(query, onlyAvailable, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, onlyAvailable]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        loadBooks(query, onlyAvailable, 0);
    };

    const books = data?.content ?? [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Library Catalog</h1>
                {data && (
                    <span className="text-sm text-gray-500">{data.totalElements} books total</span>
                )}
            </div>

            <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Search
                </button>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer whitespace-nowrap">
                    <input
                        type="checkbox"
                        checked={onlyAvailable}
                        onChange={(e) => {
                            setOnlyAvailable(e.target.checked);
                            setPage(0);
                        }}
                        className="rounded"
                    />
                    Available only
                </label>
            </form>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading catalog...</div>
            ) : books.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {book.title}
                                </h3>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Author:</span> {book.author}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Published:</span>{" "}
                                    {book.publishedYear}
                                </p>
                                <p className="text-gray-600 mb-4">
                                    <span className="font-medium">ISBN:</span> {book.isbn}
                                </p>
                                {book.category && (
                                    <span className="inline-block mb-3 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        {book.category}
                                    </span>
                                )}
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            book.availableCopies > 0
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {book.availableCopies} available (of {book.totalCopies})
                                    </span>
                                    <Link
                                        href={`/catalog/${book.id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {data && data.totalPages > 1 && (
                        <div className="flex justify-center gap-2 items-center pt-4">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm disabled:opacity-40 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600 px-2">
                                Page {(data?.number ?? 0) + 1} of {data?.totalPages}
                            </span>
                            <button
                                disabled={page >= (data?.totalPages ?? 1) - 1}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm disabled:opacity-40 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
                    No books found matching your search.
                </div>
            )}
        </div>
    );
}

