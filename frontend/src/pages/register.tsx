// src/pages/register.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"

interface RegisterResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Semua field tidak boleh kosong.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      // GANTI INI dengan URL API Anda
      const response = await axios.post<RegisterResponse>(
        "http://localhost:3000/api/auth/register", // <-- PASTIKAN URL INI BENAR
        {
          name: name,
          email: email,
          password: password,
        }
      );

  const token = response.data.token;
  const userEmail = response.data.user.email;
  const userName = response.data.user.name || '';

  localStorage.setItem("authToken", token);
  localStorage.setItem("userEmail", userEmail);
  if (userName) localStorage.setItem("userName", userName);

  navigate("/");

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registrasi gagal. Email mungkin sudah terdaftar.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container utama (Style sama dengan Login)
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-200 sm:p-4">

      <form
        onSubmit={handleSubmit}
        // Style Form (Style sama dengan Login)
        className="w-full h-screen flex flex-col justify-center 
                   sm:h-auto sm:w-full sm:max-w-md 
                   p-8 sm:p-10 bg-gray-800 sm:rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Buat Akun Baru
        </h2>

        {error && (
          <div className="bg-red-200 border border-red-500 text-red-800 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
            Nama Lengkap
          </label>
          <input
            type="text" id="name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama Kamu"
            disabled={loading}
          />
        </div>

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

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Mendaftar..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-400 hover:underline font-medium">
            Login di sini
          </Link>
        </p>
      </form>

    </div>
  );
}

export default Register;