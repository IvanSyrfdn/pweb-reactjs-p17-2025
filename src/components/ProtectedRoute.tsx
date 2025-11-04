import { Navigate } from "react-router-dom";
import type { ReactNode } from 'react'; // <-- 1. Tambahkan import ini

// 2. Ganti tipe props dari 'JSX.Element' menjadi 'ReactNode'
interface ProtectedRouteProps {
  children: ReactNode;
}
// Gunakan konsep "Props with Children" [cite: README (1).md]
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  
  // Cek apakah token autentikasi ada di local storage
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Arahkan (redirect) user ke halaman login (sesuai soal) [cite: Soal Praktikum Modul 4 - Pemrograman Web 2025.pdf]
    return <Navigate to="/login" replace />;
  }

  // Tampilkan 'children' (halaman yang seharusnya)
  return children;
};

export default ProtectedRoute;

