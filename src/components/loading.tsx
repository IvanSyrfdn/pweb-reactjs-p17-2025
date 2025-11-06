// src/components/loading.tsx
import React from 'react';

type LoadingProps = {
    message?: string;
};

const Loading: React.FC<LoadingProps> = ({ message }) => {
    return (
        <div className="flex flex-col justify-center items-center p-10">
            <div
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
            {message && (
                <p className="mt-4 text-lg text-gray-400">{message}</p>
            )}
        </div>
    );
};

export default Loading;