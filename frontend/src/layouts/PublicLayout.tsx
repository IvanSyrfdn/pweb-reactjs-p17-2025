// src/layouts/PublicLayout.tsx
import React from "react";
import Navbar from "../components/Navbar";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </>
  );
};

export default PublicLayout;
