"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    totalCopies: number;
    availableCopies: number;
    category?: string;
    description?: string;
    language?: string;
}

export default function BookDetailPage() {
    const params = useParams();
    const { user } = useAuth();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchApi(`/books/${params.id}`)
            .then((data) => setBook(data as Book))
            .catch(() => setError("Book not found"))
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) return <div className="text-center py-16 text-gray-500">Loading...</div>;

    if (error || !book) {
        return (
            <div className="text-center py-16">
                <p className="text-red-500 mb-4">{error || "Book not found"}</p>
                <Link href="/catalog" className="text-blue-600 hover:underline">
                    ← Back to Catalog
                </Link>
            </div>
        );
    }

    const isStaff = user?.roles.some(
        (r) => r === "ROLE_ADMIN" || r === "ROLE_LIBRARIAN"
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/catalog" className="text-blue-600 hover:underline text-sm">
                ← Back to Catalog
            </Link>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{book.title}</h1>
                <p className="text-xl text-gray-500 mb-6">{book.author}</p>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    <div>
                        <dt className="text-sm text-gray-500 font-medium">ISBN</dt>
                        <dd className="text-gray-800">{book.isbn}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-gray-500 font-medium">Published</dt>
                        <dd className="text-gray-800">{book.publishedYear}</dd>
                    </div>
                    {book.category && (
                        <div>
                            <dt className="text-sm text-gray-500 font-medium">Category</dt>
                            <dd className="text-gray-800">{book.category}</dd>
                        </div>
                    )}
                    {book.language && (
                        <div>
                            <dt className="text-sm text-gray-500 font-medium">Language</dt>
                            <dd className="text-gray-800">{book.language}</dd>
                        </div>
                    )}
                </div>

                {book.description && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{book.description}</p>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span
                        className={`px-4 py-2 rounded-full font-medium text-sm ${
                            book.availableCopies > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {book.availableCopies} of {book.totalCopies} copies available
                    </span>

                    {isStaff ? (
                        <Link
                            href="/admin/borrows"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                        >
                            Issue in Admin Panel
                        </Link>
                    ) : book.availableCopies > 0 ? (
                        <p className="text-sm text-gray-500">
                            Visit the library desk to borrow this book
                        </p>
                    ) : (
                        <p className="text-sm text-red-500">Currently unavailable</p>
                    )}
                </div>
            </div>
        </div>
    );
}
