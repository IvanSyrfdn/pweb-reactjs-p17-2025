// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, useMemo } from 'react';
import type { Book } from '../services/types';

// Tipe untuk item di keranjang
// Kita ambil tipe 'Book' dan tambahkan 'quantity'
interface CartItem extends Book {
    quantity: number;
}

// Tipe untuk nilai yang disediakan oleh Context
interface ICartContext {
    cartItems: CartItem[];
    addToCart: (book: Book, quantity: number) => void;
    removeFromCart: (bookId: number | string) => void;
    updateQuantity: (bookId: number | string, newQuantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

// 1. Buat Context
const CartContext = createContext<ICartContext | undefined>(undefined);

// 2. Buat Provider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (book: Book, quantity: number) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === book.id);

            if (existingItem) {
                // Jika sudah ada, update quantity
                return prevItems.map((item) =>
                    item.id === book.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Jika barang baru, tambahkan ke array
                return [...prevItems, { ...book, quantity }];
            }
        });
    };

    const removeFromCart = (bookId: number | string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId));
    };

    const updateQuantity = (bookId: number | string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(bookId); // Hapus jika jumlah 0 atau kurang
        } else {
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === bookId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Menghitung total (pakai useMemo agar tidak dihitung ulang setiap render)
    const totalItems = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 3. Buat Custom Hook (untuk kemudahan)
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};