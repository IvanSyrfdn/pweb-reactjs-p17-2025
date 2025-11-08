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
    const base = 'font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    let variantStyle = '';
    switch (variant) {
        case 'danger':
            variantStyle = 'bg-red-600 text-white hover:bg-red-700';
            break;
        case 'secondary':
            variantStyle = 'bg-gray-700 text-white hover:bg-gray-600';
            break;
        case 'primary':
        default:
            // Use warm/amber accent for dark theme
            variantStyle = 'bg-amber-400 text-black hover:bg-amber-300';
            break;
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variantStyle} ${className}`}>
            {children}
        </button>
    );
};

export default Button;