// src/pages/CartPage.tsx
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { transactionApi } from '../services/api';
import type { CreateTransactionRequest } from '../services/types';

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        setError(null);
        if (cartItems.length === 0) {
            setError("Keranjang Anda kosong.");
            return;
        }

        setIsLoading(true);

        // Format data sesuai kebutuhan API
        const transactionData: CreateTransactionRequest = {
            items: cartItems.map(item => ({
                bookId: item.id,
                quantity: item.quantity,
            })),
        };

        try {
            const newTransaction = await transactionApi.create(transactionData);
            alert("Checkout berhasil! Transaksi Anda sedang diproses.");
            clearCart(); // Kosongkan keranjang
            navigate(`/transactions/${newTransaction.id}`); // Arahkan ke detail
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal melakukan checkout.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-left text-white">Keranjang Belanja</h1>

            {error && (
                <div className="bg-red-200 border border-red-500 text-red-800 px-4 py-3 rounded mb-4" role="alert">
                    {error}
                </div>
            )}

            {cartItems.length === 0 ? (
                <div className="text-center p-10 bg-gray-800 shadow rounded-lg">
                    <p className="text-xl text-gray-400">Keranjang Anda kosong.</p>
                    <Link to="/books" className="text-blue-400 hover:underline mt-4 inline-block">
                        Mulai belanja
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-800 shadow-lg rounded-lg">
                    {/* List Item */}
                    <div className="divide-y divide-gray-700">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center p-4 gap-4">
                                <div className="flex-grow text-left">
                                    <Link to={`/books/${item.id}`} className="text-lg font-semibold text-white hover:text-blue-300">
                                        {item.title}
                                    </Link>
                                    <p className="text-sm text-gray-400">Rp {item.price.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        max={item.stock} // Batasi dengan stok
                                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                        className="w-16 p-1 border rounded bg-gray-900 border-gray-700 text-white"
                                    />
                                    <span className="text-gray-300">x Rp {item.price.toLocaleString('id-ID')}</span>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-400 font-medium"
                                >
                                    Hapus
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Total & Checkout */}
                    <div className="p-6 bg-gray-700 border-t border-gray-600 text-right">
                        <h3 className="text-xl font-bold text-gray-300">Total ({totalItems} item):</h3>
                        <p className="text-3xl font-bold text-blue-400 mb-6">
                            Rp {totalPrice.toLocaleString('id-ID')}
                        </p>
                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Memproses...' : 'Checkout Sekarang'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;