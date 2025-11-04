import { Routes, Route } from "react-router-dom";

// Impor komponen autentikasi yang SUDAH kita buat
import Login from "./pages/Login";
import Register from "./pages/register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Placeholder untuk Halaman Utama ---
// Kita buat placeholder di sini karena BooksList.tsx belum ada.
// Ini akan jadi halaman "selamat datang" setelah login.
const HomePlaceholder = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Selamat Datang!</h1>
      <p className="mt-2 text-gray-700">
        Anda berhasil login dan Rute Terproteksi (ProtectedRoute) berfungsi.
      </p>
      <p className="mt-1 text-gray-700">
        Selanjutnya, kita akan mengganti halaman ini dengan `BooksList.tsx` (Daftar Buku).
      </p>
    </div>
  );
};
// ----------------------------------------

export default function App() {
  return (
    <Routes>
      {/* --- 1. Rute Publik --- */}
      {/* Halaman yang bisa diakses siapa saja, TANPA Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- 2. Rute Terproteksi --- */}
      {/* Halaman yang HANYA bisa diakses setelah login.
        Dibungkus dengan <ProtectedRoute> 
        dan menampilkan <Navbar> + konten halaman.
      */}
      <Route
        path="/" // Ini adalah halaman utama (Daftar Buku)
        element={
          <ProtectedRoute>
            <>
              <Navbar /> {/* Navbar akan selalu tampil di sini */}
              <HomePlaceholder /> {/* Konten halaman (saat ini placeholder) */}
            </>
          </ProtectedRoute>
        }
      />
      
      {/* NANTI, kamu akan tambahkan rute terproteksi lain di sini:
        
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <> <Navbar /> <BookDetail /> </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <> <Navbar /> <TransactionsList /> </>
            </TProtectedRoute>
          }
        />
        ...dan seterusnya
      */}

      {/* --- 3. Rute 404 (Opsional tapi disarankan) --- */}
      <Route path="*" element={
        <div className="flex justify-center items-center min-h-screen">
          <h1 className="text-3xl font-bold">404: Halaman Tidak Ditemukan</h1>
        </div>
      } />
    </Routes>
  );
}
