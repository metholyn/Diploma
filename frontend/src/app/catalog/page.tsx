"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    totalCopies: number;
    availableCopies: number;
}

export default function CatalogPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const loadBooks = async (query = "") => {
        setLoading(true);
        try {
            const endpoint = query ? `/books?title=${encodeURIComponent(query)}` : "/books";
            const data = await fetchApi(endpoint);
            setBooks(data);
        } catch (error) {
            console.error("Failed to load books", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadBooks(searchQuery);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Library Catalog</h1>
            </div>

            <form onSubmit={handleSearch} className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search books by title..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </form>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading catalog...</div>
            ) : books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div key={book.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
                            <p className="text-gray-600 mb-1"><span className="font-medium">Author:</span> {book.author}</p>
                            <p className="text-gray-600 mb-1"><span className="font-medium">Published:</span> {book.publishedYear}</p>
                            <p className="text-gray-600 mb-4"><span className="font-medium">ISBN:</span> {book.isbn}</p>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {book.availableCopies} available (of {book.totalCopies})
                                </span>
                                {book.availableCopies > 0 && (
                                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">
                                        Borrow
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
                    No books found matching your search.
                </div>
            )}
        </div>
    );
}
