// src/components/Navbar.tsx
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext"; // 1. Impor useCart

function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { totalItems } = useCart(); // 2. Ambil total item dari keranjang

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }

    // Fungsi ini akan berjalan saat user pindah halaman
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false); // Tutup menu mobile
    };

    // Ini adalah cara yang lebih baik untuk mendeteksi pindah halaman
    // Jika Anda menggunakan React Router, cukup pantau 'navigate'
    // tapi karena kita tidak punya 'location' di sini, kita pakai trik
    // Mendaftarkan event listener (meskipun lebih baik memantau 'location')
    // Untuk simplisitas, kita biarkan seperti kode Anda:
    handleRouteChange(); // Panggil sekali saat mount

  }, [navigate]); // Pantau perubahan navigasi

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50"> {/* Dibuat sticky (dark) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Bagian Kiri */}
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-amber-300">
                IT-Lit
              </Link>
            </div>

            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                    ? "border-amber-400 text-amber-300"
                    : "border-transparent text-gray-300 hover:border-gray-700 hover:text-white"
                  }`
                }
                end // 'end' penting untuk root path
              >
                Daftar Buku
              </NavLink>

              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                    ? "border-amber-400 text-amber-300"
                    : "border-transparent text-gray-300 hover:border-gray-700 hover:text-white"
                  }`
                }
              >
                Transaksi
              </NavLink>
            </div>
          </div>

          {/* Bagian Kanan (Desktop) */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* 3. TOMBOL KERANJANG BARU (DESKTOP) */}
            <NavLink
              to="/cart"
              className="relative p-2 text-gray-300 hover:text-white mr-4"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </NavLink>

            {userEmail && (
              <span className="text-gray-300 text-sm mr-4">
                Halo, {userEmail}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* --- Tombol Menu Hamburger (Mobile) --- */}
          <div className="flex items-center sm:hidden">
            {/* 4. TOMBOL KERANJANG BARU (MOBILE) */}
            <NavLink
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </NavLink>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {/* Ikon (tidak berubah) */}
              <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

        </div>
      </div>

      {/* --- Dropdown Menu Mobile --- */}
      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) => `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive ? "bg-gray-800 border-amber-400 text-amber-300" : "border-transparent text-gray-300 hover:bg-gray-800 hover:border-gray-700 hover:text-white"}`}
            end
          >
            Daftar Buku
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) => `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive ? "bg-gray-800 border-amber-400 text-amber-300" : "border-transparent text-gray-300 hover:bg-gray-800 hover:border-gray-700 hover:text-white"}`}
          >
            Transaksi
          </NavLink>
        </div>

  <div className="pt-4 pb-3 border-t border-gray-800">
          {userEmail && (
            <div className="flex items-center px-4">
              <div className="ml-3">
                <div className="text-base font-medium text-gray-200">Halo,</div>
                <div className="text-sm font-medium text-gray-400">{userEmail}</div>
              </div>
            </div>
          )}
          <div className="mt-3 space-y-1">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;