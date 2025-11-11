// src/pages/Login.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"

interface LoginResponse {
  token: string;
  user: {
    email: string;
  };
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password tidak boleh kosong.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);

    try {
      // GANTI INI dengan URL API Anda
      const response = await axios.post<LoginResponse>(
        "http://localhost:3000/api/auth/login", // <-- PASTIKAN URL INI BENAR
        {
          email: email,
          password: password,
        }
      );

  const token = response.data.token;
  const userEmail = response.data.user.email;
  const userName = (response.data as any).user?.name || '';

  localStorage.setItem("authToken", token);
  localStorage.setItem("userEmail", userEmail);
  if (userName) localStorage.setItem("userName", userName);

  navigate("/");

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login gagal. Email atau password salah.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container utama:
    // - min-h-screen: Minimal setinggi layar
    // - bg-gray-900: Latar belakang dark mode
    // - sm:p-4: Memberi padding di layar tablet/desktop (sm dan ke atas)
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-200 sm:p-4">

      <form
        onSubmit={handleSubmit}
        // Style Form:
        // - w-full, h-screen: Full-width dan full-height di mobile
        // - sm:h-auto: Tinggi otomatis di desktop
        // - sm:max-w-md: Lebar maksimal lebih besar (md) di desktop
        // - sm:rounded-xl: Sudut rounded hanya di desktop
        // - Dibuat 'flex' agar form bisa di-center vertikal di mobile
        className="w-full h-screen flex flex-col justify-center 
                   sm:h-auto sm:w-full sm:max-w-md 
                   p-8 sm:p-10 bg-gray-800 sm:rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h2>

        {error && (
          <div className="bg-red-200 border border-red-500 text-red-800 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Form Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
            Email
          </label>
          <input
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@contoh.com"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
            Password
          </label>
          <input
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* Link ke Register */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-400 hover:underline font-medium">
            Register di sini
          </Link>
        </p>
      </form>

    </div>
  );
}

export default Login;