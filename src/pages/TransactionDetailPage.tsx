// src/pages/TransactionDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { transactionApi } from '../services/api';
import type { Transaction } from '../services/types';

// (Ganti dengan komponen Anda)
const LoadingSpinner: React.FC = () => <p className="text-white">Loading...</p>;
const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => <p className="text-red-400">Error: {message}</p>;

const TransactionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchTransaction = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await transactionApi.getById(id);
                setTransaction(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Transaksi tidak ditemukan.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransaction();
    }, [id]);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!transaction) return <p className="text-gray-400">Transaksi tidak ditemukan.</p>;

    return (
        <div className="container mx-auto max-w-3xl text-left">
            <button onClick={() => navigate('/transactions')} className="mb-4 text-blue-400 hover:text-blue-300">
                &laquo; Kembali ke Riwayat Transaksi
            </button>

            <h1 className="text-3xl font-bold mb-2 text-white">Detail Transaksi #{transaction.id}</h1>
            <p className="text-gray-400 mb-6">
                Tanggal: {new Date(transaction.createdAt).toLocaleString('id-ID')}
            </p>

            <div className="bg-gray-800 shadow-lg rounded-lg">
                {/* Ringkasan Item */}
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Ringkasan Pembelian</h2>
                    <div className="divide-y divide-gray-700">
                        {transaction.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center py-4">
                                <div className="text-left">
                                    <Link to={`/books/${item.book.id}`} className="font-semibold text-blue-400 hover:underline">
                                        {item.book.title}
                                    </Link>
                                    <p className="text-sm text-gray-400">
                                        {item.quantity} x Rp {item.priceAtPurchase.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <p className="text-lg font-medium text-white">
                                    Rp {(item.quantity * item.priceAtPurchase).toLocaleString('id-ID')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="p-6 bg-gray-700 border-t border-gray-600 text-right">
                    <h3 className="text-xl font-bold text-gray-300">Total Pembayaran:</h3>
                    <p className="text-3xl font-bold text-blue-400">
                        Rp {transaction.totalPrice.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailPage;