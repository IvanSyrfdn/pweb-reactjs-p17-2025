// src/layouts/PublicLayout.tsx
import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const PublicLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;
