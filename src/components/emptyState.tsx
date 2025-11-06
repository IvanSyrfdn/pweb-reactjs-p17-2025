// src/components/emptyState.tsx
import React from 'react';

type EmptyStateProps = {
    message: string;
    children?: React.ReactNode; // Untuk tombol aksi, misal "Tambah Buku"
};

const EmptyState: React.FC<EmptyStateProps> = ({ message, children }) => {
    return (
        <div className="text-center p-10 bg-gray-800 rounded-lg">
            <svg
                className="mx-auto h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
            </svg>
            <p className="mt-4 text-xl text-gray-400">{message}</p>
            {children && (
                <div className="mt-6">
                    {children}
                </div>
            )}
        </div>
    );
};

export default EmptyState;