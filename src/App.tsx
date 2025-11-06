// src/App.tsx
import { Routes, Route, Link } from "react-router-dom";

// Impor komponen autentikasi
import Login from "./pages/Login";
import Register from "./pages/register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Impor Halaman Baru Kita ---
import BooksListPage from "./pages/BookListPage";
import BookDetailPage from "./pages/BookDetailPage";
import AddBookPage from "./pages/AddBookPage";
import CartPage from "./pages/CartPage";
import TransactionsPage from "./pages/TransactionPage";
import TransactionDetailPage from "./pages/TransactionDetailPage";

// Komponen helper untuk membungkus halaman dengan Navbar
// Ini adalah cara yang Anda gunakan di App.tsx dan ini sudah bagus.
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute>
      <Navbar />
      {/* Container 'main' ini membantu memberi padding dan membatasi lebar konten 
        agar tidak menempel di Navbar atau tepi layar.
      */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </ProtectedRoute>
  );
};


export default function App() {
  return (
    <Routes>
      {/* --- 1. Rute Publik --- */}
      {/* Halaman yang bisa diakses siapa saja, TANPA Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- 2. Rute Terproteksi --- */}
      {/* Halaman yang HANYA bisa diakses setelah login.
        Dibungkus dengan <ProtectedLayout> 
        yang sudah berisi <ProtectedRoute> dan <Navbar>.
      */}

      {/* Manajemen Buku */}
      <Route
        path="/" // Halaman utama (Daftar Buku)
        element={<ProtectedLayout><BooksListPage /></ProtectedLayout>}
      />
      <Route
        path="/books/:id" // Detail Buku (Dynamic route)
        element={<ProtectedLayout><BookDetailPage /></ProtectedLayout>}
      />
      <Route
        path="/add-book" // Tambah Buku
        element={<ProtectedLayout><AddBookPage /></ProtectedLayout>}
      />

      {/* Transaksi */}
      <Route
        path="/cart" // Keranjang / Halaman Checkout
        element={<ProtectedLayout><CartPage /></ProtectedLayout>}
      />
      <Route
        path="/transactions" // List Riwayat Transaksi
        element={<ProtectedLayout><TransactionsPage /></ProtectedLayout>}
      />
      <Route
        path="/transactions/:id" // Detail Transaksi (Dynamic route)
        element={<ProtectedLayout><TransactionDetailPage /></ProtectedLayout>}
        />

      {/* --- 3. Rute 404 (Opsional tapi disarankan) --- */}
      <Route path="*" element={
        <div className="flex flex-col justify-center items-center min-h-screen text-white">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-2xl mt-4">Halaman Tidak Ditemukan</p>
          <Link to="/" className="mt-6 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
            Kembali ke Beranda
          </Link>
        </div>
      } />
    </Routes>
  );
}