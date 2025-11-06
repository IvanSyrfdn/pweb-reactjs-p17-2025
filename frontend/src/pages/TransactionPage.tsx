// src/pages/TransactionsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { transactionApi } from '../services/api';
import type { Transaction } from '../services/types';

// (Ganti dengan komponen Anda)
const LoadingSpinner: React.FC = () => <p className="text-white">Loading...</p>;
const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => <p className="text-red-400">Error: {message}</p>;
const EmptyState: React.FC<{ message: string }> = ({ message }) => <p className="text-gray-400">{message}</p>;

const TransactionsPage: React.FC = () => {
    // States untuk Data
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // States untuk Fitur
    const [searchId, setSearchId] = useState('');
    const [sort, setSort] = useState('id:desc'); // 'id:desc', 'amount:asc', 'price:desc'
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    // Fungsi Fetch Data
    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {
                search: searchId || undefined,
                sort,
                page,
                limit,
            };
            const response = await transactionApi.getAll(params);
            setTransactions(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal mengambil riwayat transaksi.");
        } finally {
            setIsLoading(false);
        }
    }, [searchId, sort, page, limit]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6 text-left text-white">Riwayat Transaksi</h1>

            {/* Kontrol Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-800 shadow rounded-lg">
                <input
                    type="text"
                    placeholder="Cari berdasarkan ID Transaksi..."
                    className="p-2 border border-gray-700 rounded bg-gray-900 text-white w-full"
                    value={searchId}
                    onChange={(e) => {
                        setSearchId(e.target.value);
                        setPage(1);
                    }}
                />
                <select
                    className="p-2 border border-gray-700 rounded bg-gray-900 text-white w-full"
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="id:desc">ID (Terbaru)</option>
                    <option value="id:asc">ID (Terlama)</option>
                    <option value="totalPrice:desc">Harga (Tertinggi)</option>
                    <option value="totalPrice:asc">Harga (Terendah)</option>
                    <option value="totalItems:desc">Jumlah (Terbanyak)</option>
                    <option value="totalItems:asc">Jumlah (Tersedikit)</option>
                </select>
            </div>

            {/* Tampilan Data */}
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            {!isLoading && !error && transactions.length === 0 && (
                <EmptyState message="Anda belum memiliki riwayat transaksi." />
            )}

            {!isLoading && !error && transactions.length > 0 && (
                <>
                    {/* Tabel Riwayat */}
                    <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-700 text-left">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase">ID Transaksi</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase">Jumlah Item</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase">Total Harga</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {transactions.map(trx => (
                                    <tr key={trx.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">#{trx.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(trx.createdAt).toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trx.totalItems}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Rp {trx.totalPrice.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link to={`/transactions/${trx.id}`} className="text-blue-400 hover:text-blue-300">
                                                Lihat Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-8 space-x-4">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white disabled:opacity-50"
                        >
                            &laquo; Sebelumnya
                        </button>
                        <span className="text-gray-300">
                            Halaman {page} dari {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white disabled:opacity-50"
                        >
                            Selanjutnya &raquo;
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TransactionsPage;