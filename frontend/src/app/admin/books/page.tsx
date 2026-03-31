"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import Toast from "@/components/Toast";

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

interface PageResponse {
    content: Book[];
    totalPages: number;
    totalElements: number;
    number: number;
}

const emptyForm = {
    title: "", author: "", isbn: "", publishedYear: new Date().getFullYear(),
    totalCopies: 1, availableCopies: 1, category: "", description: "", language: "",
};

export default function AdminBooksPage() {
    const [data, setData] = useState<PageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [page, setPage] = useState(0);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const loadBooks = async (p = 0) => {
        try {
            const result = await fetchApi(`/books?page=${p}&size=10&sort=title`);
            setData(result as PageResponse);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooks(page);
    }, [page]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBook) {
                await fetchApi(`/books/${editingBook.id}`, {
                    method: "PUT",
                    body: JSON.stringify(form),
                });
                setToast({ message: "Book updated successfully!", type: "success" });
            } else {
                await fetchApi("/books", { method: "POST", body: JSON.stringify(form) });
                setToast({ message: "Book added successfully!", type: "success" });
            }
            setForm(emptyForm);
            setEditingBook(null);
            loadBooks(page);
        } catch (error: unknown) {
            setToast({
                message: "Error: " + (error instanceof Error ? error.message : String(error)),
                type: "error",
            });
        }
    };

    const startEdit = (book: Book) => {
        setEditingBook(book);
        setForm({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publishedYear: book.publishedYear,
            totalCopies: book.totalCopies,
            availableCopies: book.availableCopies,
            category: book.category ?? "",
            description: book.description ?? "",
            language: book.language ?? "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingBook(null);
        setForm(emptyForm);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this book?")) return;
        try {
            await fetchApi(`/books/${id}`, { method: "DELETE" });
            setToast({ message: "Book deleted.", type: "success" });
            loadBooks(page);
        } catch (error: unknown) {
            setToast({
                message: "Error: " + (error instanceof Error ? error.message : String(error)),
                type: "error",
            });
        }
    };

    if (loading) return <div>Loading books...</div>;

    const books = data?.content ?? [];

    return (
        <div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Books</h1>

            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                <h3 className="font-semibold text-lg mb-4">
                    {editingBook ? `Editing: ${editingBook.title}` : "Add New Book"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <input type="text" placeholder="Title" required className="border p-2 rounded text-gray-800"
                        value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    <input type="text" placeholder="Author" required className="border p-2 rounded text-gray-800"
                        value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                    <input type="text" placeholder="ISBN" required className="border p-2 rounded text-gray-800"
                        value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
                    <input type="number" placeholder="Year" required className="border p-2 rounded text-gray-800"
                        value={form.publishedYear} onChange={(e) => setForm({ ...form, publishedYear: parseInt(e.target.value) })} />
                    <input type="number" placeholder="Total Copies" required min={1} className="border p-2 rounded text-gray-800"
                        value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: parseInt(e.target.value) })} />
                    <input type="number" placeholder="Available Copies" required min={0} className="border p-2 rounded text-gray-800"
                        value={form.availableCopies} onChange={(e) => setForm({ ...form, availableCopies: parseInt(e.target.value) })} />
                    <input type="text" placeholder="Category (optional)" className="border p-2 rounded text-gray-800"
                        value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    <input type="text" placeholder="Language (optional)" className="border p-2 rounded text-gray-800"
                        value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
                    <textarea placeholder="Description (optional)" className="border p-2 rounded text-gray-800 md:col-span-1"
                        rows={2} value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="flex gap-3">
                    <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                        {editingBook ? "Save Changes" : "Add Book"}
                    </button>
                    {editingBook && (
                        <button type="button" onClick={cancelEdit}
                            className="bg-white text-gray-700 border border-gray-300 px-5 py-2 rounded hover:bg-gray-50">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Author</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Copies (Avail/Total)</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((b) => (
                            <tr key={b.id} className={`border-b hover:bg-gray-50 ${editingBook?.id === b.id ? "bg-blue-50" : ""}`}>
                                <td className="p-4 text-sm font-medium text-gray-800">{b.title}</td>
                                <td className="p-4 text-sm text-gray-700">{b.author}</td>
                                <td className="p-4 text-sm text-gray-500">{b.category ?? "â€”"}</td>
                                <td className="p-4 text-sm text-gray-700">{b.availableCopies} / {b.totalCopies}</td>
                                <td className="p-4 text-sm flex gap-4">
                                    <button onClick={() => startEdit(b)}
                                        className="text-blue-600 hover:text-blue-800 font-medium">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(b.id)}
                                        className="text-red-600 hover:text-red-800 font-medium">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data && data.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 border border-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-50">
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {(data.number) + 1} of {data.totalPages}
                    </span>
                    <button disabled={page >= data.totalPages - 1} onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 border border-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-50">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
