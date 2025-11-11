// src/layouts/ProtectedLayout.tsx
import React from "react";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { Outlet } from "react-router-dom";

const ProtectedLayout: React.FC = () => {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </ProtectedRoute>
  );
};

export default ProtectedLayout;