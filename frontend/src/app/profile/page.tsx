"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    enabled: boolean;
}

interface UserCard {
    id: number;
    cardNumber: string;
    issueDate: string;
}

interface BorrowRecord {
    id: number;
    book: { id: number; title: string; author: string };
    borrowDate: string;
    expectedReturnDate: string;
    actualReturnDate?: string;
    status: string;
}

const STATUS_COLORS: Record<string, string> = {
    BORROWED: "bg-blue-100 text-blue-800",
    RETURNED: "bg-green-100 text-green-800",
    OVERDUE: "bg-red-100 text-red-800",
};

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [card, setCard] = useState<UserCard | null>(null);
    const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        const load = async () => {
            try {
                const profileData = await fetchApi("/users/me");
                setProfile(profileData as UserProfile);

                const cardData = await fetchApi(`/users/${user.id}/card`).catch(() => null);
                if (cardData) {
                    const c = cardData as UserCard;
                    setCard(c);
                    const borrowData = await fetchApi(`/borrow/card/${c.id}`);
                    setBorrows(borrowData as BorrowRecord[]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user, router]);

    if (!user || loading) {
        return <div className="text-center py-16 text-gray-500">Loading...</div>;
    }

    const activeBorrows = borrows.filter(
        (b) => b.status === "BORROWED" || b.status === "OVERDUE"
    );
    const history = borrows.filter((b) => b.status === "RETURNED");

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
                    {profile && (
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-xs text-gray-500 uppercase tracking-wide">Name</dt>
                                <dd className="font-medium text-gray-900">
                                    {profile.firstName} {profile.lastName}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-500 uppercase tracking-wide">Email</dt>
                                <dd className="font-medium text-gray-900">{profile.email}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-500 uppercase tracking-wide">Role</dt>
                                <dd className="capitalize font-medium text-gray-900">
                                    {profile.role.toLowerCase()}
                                </dd>
                            </div>
                        </dl>
                    )}
                    <button
                        onClick={logout}
                        className="mt-6 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md text-sm hover:bg-red-100 transition"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Library Card</h2>
                    {card ? (
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-xs text-gray-500 uppercase tracking-wide">Card Number</dt>
                                <dd className="font-mono font-bold text-xl text-blue-700">
                                    {card.cardNumber}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-500 uppercase tracking-wide">Issued</dt>
                                <dd className="font-medium text-gray-900">
                                    {new Date(card.issueDate).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-500 uppercase tracking-wide">
                                    Active Borrows
                                </dt>
                                <dd className="font-medium text-gray-900">{activeBorrows.length}</dd>
                            </div>
                        </dl>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No library card assigned yet. Contact a librarian.
                        </p>
                    )}
                </div>
            </div>

            {card && (
                <>
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Currently Borrowed ({activeBorrows.length})
                        </h2>
                        {activeBorrows.length === 0 ? (
                            <div className="text-center py-8 bg-white rounded-lg border border-gray-100 text-gray-400">
                                No active borrows
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {activeBorrows.map((b) => (
                                    <div
                                        key={b.id}
                                        className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800">{b.book.title}</p>
                                            <p className="text-sm text-gray-500">{b.book.author}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Due:{" "}
                                                {new Date(b.expectedReturnDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[b.status]}`}
                                        >
                                            {b.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Borrow History ({history.length})
                        </h2>
                        {history.length === 0 ? (
                            <div className="text-center py-8 bg-white rounded-lg border border-gray-100 text-gray-400">
                                No returned books yet
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                                                Book
                                            </th>
                                            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                                                Borrowed
                                            </th>
                                            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                                                Returned
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((b) => (
                                            <tr
                                                key={b.id}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-800">
                                                        {b.book.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {b.book.author}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {new Date(b.borrowDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {b.actualReturnDate
                                                        ? new Date(
                                                              b.actualReturnDate
                                                          ).toLocaleDateString()
                                                        : "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
