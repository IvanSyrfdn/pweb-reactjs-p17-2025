// src/components/button.tsx
import React from 'react';

// Tentukan tipe props untuk tombol
type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'primary' | 'danger' | 'secondary'; // Varian untuk style
    className?: string; // Untuk menambahkan style kustom
};

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    variant = 'primary',
    className = '',
}) => {
    // Style dasar tombol
    const baseStyle = "font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    // Style berdasarkan varian
    let variantStyle = '';
    switch (variant) {
        case 'danger':
            variantStyle = 'bg-red-600 text-white hover:bg-red-700';
            break;
        case 'secondary':
            variantStyle = 'bg-gray-600 text-white hover:bg-gray-500';
            break;
        case 'primary':
        default:
            variantStyle = 'bg-blue-600 text-white hover:bg-blue-700';
            break;
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variantStyle} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;