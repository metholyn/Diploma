import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center items-center text-center space-y-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl p-8 shadow-sm">
      <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
        Welcome to NextGen Library
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl">
        Discover thousands of books, manage your reading lists, and enjoy a seamless modern reading experience.
      </p>

      <div className="flex gap-4 pt-4">
        <Link
          href="/catalog"
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg text-lg"
        >
          Browse Catalog
        </Link>
        <Link
          href="/login"
          className="bg-white text-blue-600 border border-blue-200 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition shadow-sm text-lg"
        >
          Sign In
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl text-left">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Vast Collection</h3>
          <p className="text-gray-600">Access thousands of books ranging from academic literature to recent fiction bestsellers.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Borrowing</h3>
          <p className="text-gray-600">One-click reservation system makes picking up your favorite books easier than ever.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Digital Management</h3>
          <p className="text-gray-600">Track your overdue books, manage returns and check your borrowing history online.</p>
        </div>
      </div>
    </div>
  );
}
