// src/components/Navbar.tsx

import { useNavigate, Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";



function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // --- State untuk Menu Mobile ---
  // Kita pakai useState [cite: README (1).md] untuk melacak apakah menu mobile terbuka
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
    
    // Saat pindah halaman, tutup menu mobile
    setIsMobileMenuOpen(false);
  }, [navigate]); // Kita bisa pantau 'navigate' atau path, tapi ini cukup

  // --- Fungsi Logout ---
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md relative"> {/* Tambah 'relative' */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Bagian Kiri: Logo & Navigasi Utama (Desktop) */}
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                IT-Lit
              </Link>
            </div>
            
            {/* Link Navigasi (Desktop) */}
            {/* 'hidden' di mobile, 'sm:flex' di desktop */}
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`
                }
                end
              >
                Daftar Buku
              </NavLink>
              
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`
                }
              >
                Transaksi
              </NavLink>
            </div>
          </div>

          {/* Bagian Kanan: Info User & Logout (Desktop) */}
          {/* 'hidden' di mobile, 'sm:flex' di desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {userEmail && (
              <span className="text-gray-700 text-sm mr-4">
                Halo, {userEmail}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* --- Tombol Menu Hamburger (Mobile) --- */}
          {/* 'sm:hidden' (sembunyi di desktop), 'flex' di mobile */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Toggle state
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Buka menu</span>
              {/* Ikon hamburger (jika menu tertutup) */}
              <svg 
                className={`h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`} 
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Ikon 'X' (jika menu terbuka) */}
              <svg 
                className={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} 
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* --- Dropdown Menu Mobile --- */}
      {/* Tampil/sembunyi berdasarkan state 'isMobileMenuOpen' */}
      {/* 'sm:hidden' (selalu sembunyi di desktop) */}
      <div 
        className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} 
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              }`
            }
            end
          >
            Daftar Buku
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              }`
            }
          >
            Transaksi
          </NavLink>
        </div>
        
        {/* Info User & Logout (Mobile) */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          {userEmail && (
            <div className="flex items-center px-4">
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Halo,</div>
                <div className="text-sm font-medium text-gray-500">{userEmail}</div>
              </div>
            </div>
          )}
          <div className="mt-3 space-y-1">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
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
