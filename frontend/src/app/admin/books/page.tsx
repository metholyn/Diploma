"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function AdminBooksPage() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        title: "", author: "", isbn: "", publishedYear: 2024, totalCopies: 1, availableCopies: 1
    });

    const loadBooks = async () => {
        try {
            const data = await fetchApi("/books");
            setBooks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchApi("/books", {
                method: "POST",
                body: JSON.stringify(form)
            });
            setForm({ title: "", author: "", isbn: "", publishedYear: 2024, totalCopies: 1, availableCopies: 1 });
            loadBooks();
        } catch (error: any) {
            alert("Error adding book: " + error.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetchApi(`/books/${id}`, { method: "DELETE" });
            loadBooks();
        } catch (error: any) {
            alert("Error deleting book: " + error.message);
        }
    };

    if (loading) return <div>Loading books...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Books</h1>

            <form onSubmit={handleAddBook} className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                <h3 className="font-semibold text-lg mb-4">Add New Book</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <input type="text" placeholder="Title" required className="border p-2 rounded"
                        value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <input type="text" placeholder="Author" required className="border p-2 rounded"
                        value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                    <input type="text" placeholder="ISBN" required className="border p-2 rounded"
                        value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} />
                    <input type="number" placeholder="Year" required className="border p-2 rounded"
                        value={form.publishedYear} onChange={e => setForm({ ...form, publishedYear: parseInt(e.target.value) })} />
                    <input type="number" placeholder="Total Copies" required className="border p-2 rounded"
                        value={form.totalCopies} onChange={e => setForm({ ...form, totalCopies: parseInt(e.target.value), availableCopies: parseInt(e.target.value) })} />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Book</button>
            </form>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Author</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Copies (Avail/Total)</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(b => (
                            <tr key={b.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-sm">{b.id}</td>
                                <td className="p-4 text-sm">{b.title}</td>
                                <td className="p-4 text-sm">{b.author}</td>
                                <td className="p-4 text-sm">{b.availableCopies} / {b.totalCopies}</td>
                                <td className="p-4 text-sm">
                                    <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
