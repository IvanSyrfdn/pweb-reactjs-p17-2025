// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import BooksListPage from "./pages/BookListPage";
import BookDetailPage from "./pages/BookDetailPage";
import AddBookPage from "./pages/AddBookPage";
import TransactionsPage from "./pages/TransactionPage";
import TransactionDetailPage from "./pages/TransactionDetailPage";

export default function App() {
  return (
    <Routes>
      {/* ----------------- 🔐 Autentikasi ----------------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ----------------- 📚 Manajemen Buku (bebas login) ----------------- */}
      <Route
        path="/"
        element={<PublicLayout><BooksListPage /></PublicLayout>}
      />
      <Route
        path="/books/:id"
        element={<PublicLayout><BookDetailPage /></PublicLayout>}
      />
      <Route
        path="/add-book"
        element={<PublicLayout><AddBookPage /></PublicLayout>}
      />

      {/* ----------------- 💸 Transaksi (hanya login) ----------------- */}
      <Route
        path="/transactions"
        element={<ProtectedLayout><TransactionsPage /></ProtectedLayout>}
      />
      <Route
        path="/transactions/:id"
        element={<ProtectedLayout><TransactionDetailPage /></ProtectedLayout>}
      />

      {/* ----------------- ❌ 404 Not Found ----------------- */}
      <Route
        path="*"
        element={
          <div className="flex flex-col justify-center items-center min-h-screen text-white">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-2xl mt-4">Halaman Tidak Ditemukan</p>
          </div>
        }
      />

      {/* //---------------------------------------------------
        // MODE OPSIONAL: Jika ingin langsung redirect ke halaman login
        // tinggal UNCOMMENT baris di bawah ini.
        // ---------------------------------------------------
        <Route path="*" element={<Navigate to="/login" replace />} />
      */}
    </Routes>
  );
}