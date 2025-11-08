// src/pages/BooksListPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/card';
import Button from '../components/button';
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
    const [genreId, setGenreId] = useState<string | number>('');
    const [genres, setGenres] = useState<Array<{id:number,name:string,count?:number}>>([]);
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
                genreId: genreId || undefined,
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
    }, [search, condition, sort, page, limit, genreId]);

    // Fetch genres for sidebar
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const g = await (await fetch('/api/genres')).json();
                setGenres(g);
            } catch (e) {
                // ignore
            }
        };
        fetchGenres();
    }, []);

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
        <div className="container mx-auto px-4">
                <div className="relative mb-8 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-10 rounded-lg">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-5xl font-extrabold text-white leading-tight">Katalog Buku</h1>
                                <p className="mt-2 text-gray-400">Temukan buku favoritmu — telusuri, lihat detail, dan kelola koleksi.</p>

                                {/* Large search inside hero */}
                                <div className="mt-6 max-w-2xl">
                                    <div className="flex gap-3">
                                        <input type="text" placeholder="Cari produk, judul, atau penulis..." value={search} onChange={(e)=>{setSearch(e.target.value); setPage(1);}} className="flex-1 p-3 rounded-md bg-gray-800 text-white border border-gray-700" />
                                        <Button variant="primary">Cari</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <Link to="/add-book">
                                    <Button variant="primary">+ Tambah Buku</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Sidebar genres */}
                        <aside className="hidden md:block md:col-span-1">
                            <div className="bg-gray-800 rounded-lg p-4 sticky top-24">
                                <h4 className="text-sm font-semibold text-gray-200 mb-3">Kategori</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <button onClick={() => { setGenreId(''); setPage(1); }} className={`w-full text-left px-3 py-2 rounded ${genreId === '' ? 'bg-gray-700 text-amber-300' : 'text-gray-300 hover:bg-gray-700'}`}>Semua Kategori</button>
                                    </li>
                                    {genres.map(g => (
                                        <li key={g.id}>
                                            <button onClick={() => { setGenreId(g.id); setPage(1); }} className={`w-full text-left px-3 py-2 rounded ${String(genreId) === String(g.id) ? 'bg-gray-700 text-amber-300' : 'text-gray-300 hover:bg-gray-700'}`}>
                                                {g.name} <span className="text-sm text-gray-500">({g.count})</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        <main className="md:col-span-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {books.map((book) => (
                                    <div key={book.id} className="flex flex-col gap-3">
                                        <Card
                                            title={book.title}
                                            subtitle={book.genre?.name}
                                            price={book.price}
                                            image={(book as any).image_url || null}
                                        >
                                            <div className="text-sm text-gray-400">{book.writer}</div>
                                            <div className="mt-2 text-sm text-gray-500">Stok: {book.stock} • {book.condition}</div>
                                        </Card>

                                        <div className="flex gap-2">
                                            <Link to={`/books/${book.id}`} className="flex-1">
                                                <Button variant="secondary" className="w-full">Detail</Button>
                                            </Link>
                                            <Button variant="danger" onClick={() => handleDelete(book.id)} className="w-full">Hapus</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </main>
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