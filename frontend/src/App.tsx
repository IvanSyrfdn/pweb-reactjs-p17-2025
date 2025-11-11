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
import CartPage from "./pages/CartPage";

export default function App() {
  return (
    <Routes>
      {/* Public routes (login/register) */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Default root -> redirect to /books */}
        <Route path="/" element={<Navigate to="/books" replace />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/books" element={<BooksListPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/add-book" element={<AddBookPage />} />
  <Route path="/cart" element={<CartPage />} />

        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/transactions/:id" element={<TransactionDetailPage />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex flex-col justify-center items-center min-h-screen text-white">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-2xl mt-4">Halaman Tidak Ditemukan</p>
          </div>
        }
      />
    </Routes>
  );
}