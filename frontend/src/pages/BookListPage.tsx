// src/pages/BooksListPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookApi } from '../services/api';
import type { Book } from '../services/types';
// CATATAN: Ganti komponen Loading/Error/Empty di bawah ini
// dengan komponen dari folder /components Anda!
// misal: import Loading from '../components/loading';

const LoadingSpinner: React.FC = () => (
    <div className="text-center p-10">
        <p className="text-xl text-gray-400">Loading...</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-200 border border-red-500 text-red-800 px-4 py-3 rounded m-4" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center p-10 bg-gray-800 rounded-lg">
        <p className="text-xl text-gray-400">{message}</p>
    </div>
);

const BooksListPage: React.FC = () => {
    // States untuk Data
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // States untuk Fitur
    const [search, setSearch] = useState('');
    const [condition, setCondition] = useState(''); // 'Baru' atau 'Bekas'
    const [sort, setSort] = useState('title:asc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(8); // 8 buku per halaman

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {
                search: search || undefined,
                condition: condition || undefined,
                sort,
                page,
                limit,
            };
            const response = await bookApi.getAll(params);
            setBooks(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Gagal mengambil data buku.");
        } finally {
            setIsLoading(false);
        }
    }, [search, condition, sort, page, limit]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleDelete = async (bookId: number | string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
            try {
                await bookApi.delete(bookId);
                alert("Buku berhasil dihapus.");
                fetchBooks(); // Refresh data
            } catch (err: any) {
                setError(err.response?.data?.message || "Gagal menghapus buku.");
            }
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Katalog Buku</h1>
                <Link
                    to="/add-book"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    + Tambah Buku
                </Link>
            </div>

            {/* Kontrol Filter, Search, Sort */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-800 shadow rounded-lg">
                <input
                    type="text"
                    placeholder="Cari judul atau penulis..."
                    className="p-2 border border-gray-700 rounded bg-gray-900 text-white w-full"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
                <select
                    className="p-2 border border-gray-700 rounded bg-gray-900 text-white w-full"
                    value={condition}
                    onChange={(e) => {
                        setCondition(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">Semua Kondisi</option>
                    <option value="Baru">Baru</option>
                    <option value="Bekas">Bekas</option>
                </select>
                <select
                    className="p-2 border border-gray-700 rounded bg-gray-900 text-white w-full"
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="title:asc">Judul (A-Z)</option>
                    <option value="title:desc">Judul (Z-A)</option>
                    <option value="publication_year:desc">Tahun Terbit (Terbaru)</option>
                    <option value="publication_year:asc">Tahun Terbit (Terlama)</option>
                </select>
            </div>

            {/* Tampilan Data */}
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}

            {!isLoading && !error && books.length === 0 && (
                <EmptyState message="Tidak ada buku yang ditemukan." />
            )}

            {!isLoading && !error && books.length > 0 && (
                <>
                    {/* List Buku (Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div key={book.id} className="bg-gray-800 shadow-lg rounded-lg overflow-hidden flex flex-col text-left">
                                {/* <img src={book.image_url || '...'} alt={book.title} className="h-48 w-full object-cover" /> */}
                                <div className="p-4 flex-grow">
                                    <span className="text-sm text-blue-400">{book.genre.name}</span>
                                    <h3 className="text-lg font-bold text-white truncate mt-1">
                                        <Link to={`/books/${book.id}`} className="hover:text-blue-300">{book.title}</Link>
                                    </h3>
                                    <p className="text-sm text-gray-400">{book.writer}</p>
                                    <p className="text-lg font-semibold text-blue-500 mt-2">
                                        Rp {book.price.toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-sm text-gray-500">Stok: {book.stock} | {book.condition}</p>
                                </div>
                                <div className="p-4 bg-gray-700 border-t border-gray-600 flex gap-2">
                                    <Link
                                        to={`/books/${book.id}`}
                                        className="flex-1 text-center bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                                    >
                                        Detail
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(book.id)}
                                        className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
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

export default BooksListPage;