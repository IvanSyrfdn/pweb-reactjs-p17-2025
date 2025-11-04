import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom" 

// Tentukan tipe data untuk respons API
interface LoginResponse {
  token: string;
  user: {
    email: string;
    // Tambahkan 'name' atau properti lain jika ada
  };
}

function Login() {
  // --- States ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State untuk UX (Loading & Error) [cite: Soal Praktikum Modul 4 - Pemrograman Web 2025.pdf]
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // --- Handlers ---
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Mencegah reload halaman [cite: README (1).md]
    setError(null);

    // Validasi form sisi client [cite: Soal Praktikum Modul 4 - Pemrograman Web 2025.pdf]
    if (!email || !password) {
      setError("Email dan password tidak boleh kosong.");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true); // Tampilkan loading state [cite: Soal Praktikum Modul 4 - Pemrograman Web 2025.pdf]

    try {
      // Panggil API Login
      const response = await axios.post<LoginResponse>(
        "URL_API_LOGIN_KAMU", // <-- GANTI INI
        {
          email: email,
          password: password,
        }
      );

      // Simpan token ke local storage [cite: Soal Praktikum Modul 4 - Pemrograman Web 2025.pdf]
      const token = response.data.token;
      const userEmail = response.data.user.email; // Ambil email dari respons
      
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", userEmail); // Simpan email untuk Navbar

      // Arahkan ke halaman daftar buku [cite: Soal Praktikum Modul 4 - Pemrograman Web 2025.pdf]
      navigate("/");

    } catch (err) {
      // Tampilkan error state [cite: Soal Praktikum Modul 4 - Pemrograman Web 2025.pdf]
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login gagal. Email atau password salah.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false); // Sembunyikan loading state [cite: Soal Praktikum Modul 4 - Pemrograman Web 2025.pdf]
    }
  };

  // --- Render ---
  return (
    // Perbaikan Layout: Wrapper full-screen agar form di tengah
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 bg-white shadow-lg rounded-xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {/* Conditional Rendering untuk Error State [cite: README (1).md] */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* --- Form Input --- */}
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@contoh.com"
            disabled={loading}
          />
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {/* --- Tombol Submit --- */}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {/* Conditional Rendering untuk Teks Tombol [cite: README (1).md] */}
          {loading ? "Loading..." : "Login"}
        </button>
        
        {/* --- Link ke Register --- */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register di sini
          </Link>
        </p>
      </form>

    </div> // Penutup div container layout
  );
}

export default Login;

