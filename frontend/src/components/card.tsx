// src/components/card.tsx
import React from 'react';

type CardProps = {
    title?: string;
    subtitle?: string;
    price?: number;
    children?: React.ReactNode;
    image?: string | null;
    className?: string;
};

const Card: React.FC<CardProps> = ({ title, subtitle, price, children, image, className = '' }) => {
    return (
        <div className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-md ${className} transition-all duration-200 group/card hover:shadow-amber-400/40 hover:shadow-2xl hover:border-amber-400/60 focus-within:border-amber-400/80 focus-within:shadow-amber-400/40`}> 
            {image ? (
                <img src={image} alt={title} className="w-full h-56 object-cover group-hover/card:scale-[1.03] group-hover/card:shadow-amber-400/30 transition-all duration-200" />
            ) : (
                <div className="w-full h-56 bg-gradient-to-tr from-gray-800 to-white-700 flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" />
                    </svg>
                </div>
            )}
            <div className="p-4">
                {subtitle && <div className="text-sm text-amber-300 font-medium drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]">{subtitle}</div>}
                {title && <h3 className="mt-1 text-lg font-semibold text-white truncate group-hover/card:text-amber-200 transition-all drop-shadow-[0_0_8px_rgba(255,255,255,0.08)]">{title}</h3>}
                {typeof price === 'number' && (
                    <div className="mt-2 text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">Rp {price.toLocaleString('id-ID')}</div>
                )}
                <div className="mt-3 text-sm text-gray-400 group-hover/card:text-amber-200 transition-all">{children}</div>
            </div>
        </div>
    );
};

export default Card;