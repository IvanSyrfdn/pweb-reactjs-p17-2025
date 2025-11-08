// src/components/button.tsx
import React from 'react';

// Button props
type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'primary' | 'danger' | 'secondary';
    className?: string;
};

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    variant = 'primary',
    className = '',
}) => {
    const base = 'font-semibold py-2 px-4 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';

    let variantStyle = '';
        switch (variant) {
            case 'danger':
                variantStyle = 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-400/60 hover:shadow-red-400/30';
                break;
            case 'secondary':
                variantStyle = 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-2 focus:ring-amber-400/40 hover:shadow-amber-400/10';
                break;
            case 'primary':
            default:
                // Blue primary for better contrast
                variantStyle = 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#60a5fa] hover:to-[#1e40af] focus:ring-2 focus:ring-blue-400/50 hover:shadow-blue-400/30';
                break;
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variantStyle} ${className}`}>
            {children}
        </button>
    );
};

export default Button;