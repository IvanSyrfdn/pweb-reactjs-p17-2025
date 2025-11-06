// src/components/errorState.tsx
import React from 'react';

type ErrorStateProps = {
    message: string | null; // Terima string atau null
};

const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
    // Jangan tampilkan apapun jika tidak ada pesan error
    if (!message) {
        return null;
    }

    return (
        <div
            className="bg-red-200 border border-red-500 text-red-800 px-4 py-3 rounded mb-4"
            role="alert"
        >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    );
};

export default ErrorState;