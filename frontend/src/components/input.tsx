// src/components/input.tsx
import React from 'react';

// Ambil semua props standar dari input HTML dan tambahkan 'label'
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    id: string; // 'id' wajib ada untuk 'htmlFor' di label
};

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
    return (
        <div className="mb-4">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-400 mb-2 text-left"
            >
                {label}
            </label>
            <input
                id={id}
                {...props} // Sebar semua props sisa (type, value, onChange, placeholder, dll.)
                className={`w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            />
        </div>
    );
};

export default Input;