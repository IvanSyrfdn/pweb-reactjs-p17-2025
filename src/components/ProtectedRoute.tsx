// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}
// Gunakan konsep "Props with Children"
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

  // Cek apakah token autentikasi ada di local storage
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Arahkan (redirect) user ke halaman login (sesuai soal)
    return <Navigate to="/login" replace />;
  }

  // Tampilkan 'children' (halaman yang seharusnya)
  return children;
};

export default ProtectedRoute;