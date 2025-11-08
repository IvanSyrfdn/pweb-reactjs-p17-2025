import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/card';
import Button from '../components/button';
import { bookApi } from '../services/api';
import type { Book } from '../services/types';

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
    // Data states
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Feature states
    const [search, setSearch] = useState('');
    const [condition, setCondition] = useState('');
    const [genreId, setGenreId] = useState<string | number>('');
    const [genres, setGenres] = useState<Array<{ id: number; name: string; count?: number }>>([]);
    const [sortTitle, setSortTitle] = useState('title:asc');
    const [sortYear, setSortYear] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(8);

    // Customize hex colors per genre here. Change values as you wish.
    const genreColors: Record<string, string> = {
        Programming: '#0ea5e9',
        Design: '#06b6d4',
        Business: '#f97316',
        Fiction: '#ef4444',
        Education: '#10b981',
        History: '#8b5cf6',
        Science: '#06b6d4',
        Art: '#fb7185',
        Children: '#f59e0b'
    };

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            let sort = sortTitle;
            if (sortYear) sort = sortYear;
            const params = {
                search: search || undefined,
                condition: condition || undefined,
                genreId: genreId || undefined,
                sort,
                page,
                limit
            } as any;
            const res = await bookApi.getAll(params);
            setBooks(res.data || []);
            setTotalPages(res.meta?.totalPages || 1);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Gagal mengambil data buku.');
        } finally {
            setIsLoading(false);
        }
    }, [search, condition, sortTitle, sortYear, page, limit, genreId]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // fetch genres
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/genres');
                const data = await res.json();
                setGenres(data || []);
            } catch (err) {
                // ignore
            }
        };
        load();
    }, []);

    const handleDelete = async (bookId: number | string) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;
        try {
            await bookApi.delete(bookId);
            fetchBooks();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal menghapus buku.');
        }
    };

    return (
        <div className="container mx-auto px-4">
            {/* HERO */}
            <div className="relative mb-8 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#232946] via-[#16161a] to-[#0f0f1a] p-10 rounded-lg shadow-xl border border-[#232946]">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-5xl font-extrabold text-white leading-tight">Katalog Buku</h1>
                            <p className="mt-2 text-gray-300">Temukan buku favoritmu — telusuri, lihat detail, dan kelola koleksi.</p>

                                            <div className="mt-6 max-w-2xl">
                                                <div className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Cari produk, judul, atau penulis..."
                                                        value={search}
                                                        onChange={(e) => {
                                                            setSearch(e.target.value);
                                                            setPage(1);
                                                        }}
                                                        className="flex-1 p-3 rounded-lg bg-[#232946] text-white border border-[#393a4c] focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400 hover:border-blue-400/40 hover:bg-[#2a3352] transition-all shadow-inner"
                                                    />
                                                    <Button variant="primary" className="shadow-xl hover:shadow-blue-400/40 hover:scale-105 transition-all px-8 text-lg">
                                                        Cari
                                                    </Button>
                                                </div>
                                            </div>
                        </div>

                        <div className="flex-shrink-0">
                                            <Link to="/add-book">
                                                <button className="px-6 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-lg transform transition-all duration-200 shadow-lg hover:shadow-blue-400/40 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-400/50">
                                                    + Tambah Buku
                                                </button>
                                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter/Sort row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-[#181823] shadow-lg rounded-lg border border-[#232946]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <select
                        className="p-3 border border-gray-700 rounded-lg bg-[#232946] text-white w-full focus:ring-2 focus:ring-amber-400/60 hover:border-amber-400/40 hover:bg-[#2a3352] transition-all shadow-inner"
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
                        className="p-3 border border-gray-700 rounded-lg bg-[#232946] text-white w-full focus:ring-2 focus:ring-amber-400/60 hover:border-amber-400/40 hover:bg-[#2a3352] transition-all shadow-inner"
                        value={sortTitle}
                        onChange={(e) => {
                            setSortTitle(e.target.value);
                            setSortYear('');
                            setPage(1);
                        }}
                    >
                        <option value="title:asc">Judul (A-Z)</option>
                        <option value="title:desc">Judul (Z-A)</option>
                    </select>

                    <select
                        className="p-3 border border-gray-700 rounded-lg bg-[#232946] text-white w-full focus:ring-2 focus:ring-amber-400/60 hover:border-amber-400/40 hover:bg-[#2a3352] transition-all shadow-inner"
                        value={sortYear}
                        onChange={(e) => {
                            setSortYear(e.target.value);
                            setSortTitle('');
                            setPage(1);
                        }}
                    >
                        <option value="">Tahun Terbit</option>
                        <option value="publication_year:desc">Tahun Terbit (Terbaru)</option>
                        <option value="publication_year:asc">Tahun Terbit (Terlama)</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}

            {!isLoading && !error && books.length === 0 && <EmptyState message="Tidak ada buku yang ditemukan." />}

            {!isLoading && !error && books.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Sidebar: vertical genre boxes */}
                        <aside className="md:col-span-1">
                            <div className="bg-[#0f1116] rounded-lg p-4 sticky top-24 border border-[#232946] shadow-xl">
                                <h4 className="text-lg font-bold text-white mb-4">Kategori Buku</h4>

                                <div className="flex flex-col gap-3">
                                    {/* All box */}
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => {
                                            setGenreId('');
                                            setPage(1);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setGenreId('');
                                                setPage(1);
                                            }
                                        }}
                                        className={`w-full cursor-pointer rounded-lg p-4 transition-all duration-200 border shadow-sm flex items-center justify-between ${
                                            genreId === ''
                                                ? 'ring-2 ring-blue-400/60 bg-emerald-500/10 border-blue-400 text-white shadow-blue-500/20'
                                                : 'bg-[#15151a] border-[#232946] hover:ring-2 hover:ring-emerald-400/30 hover:bg-emerald-500/5'
                                        }`}
                                    >
                                        <div>
                                            <div className="font-semibold text-lg">Semua Kategori</div>
                                            <div className="text-sm text-gray-400">Tampilkan semua buku</div>
                                        </div>
                                        <div className="text-sm font-semibold text-blue-400">{genres.reduce((acc, g) => acc + (g.count || 0), 0)} buku</div>
                                    </div>

                                    {/* One box per genre */}
                                    {genres.map((g) => {
                                        const hex = genreColors[g.name] || '#374151';
                                        return (
                                            <div
                                                key={g.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => {
                                                    setGenreId(g.id);
                                                    setPage(1);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        setGenreId(g.id);
                                                        setPage(1);
                                                    }
                                                }}
                                                className={`w-full cursor-pointer rounded-lg p-4 transition-all duration-200 border shadow-sm flex items-center justify-between`}
                                                style={{
                                                    background: String(genreId) === String(g.id) ? `linear-gradient(135deg, ${hex}, ${hex}80)` : undefined,
                                                    borderColor: String(genreId) === String(g.id) ? hex : undefined
                                                }}
                                            >
                                                <div>
                                                    <div className="font-semibold text-lg" style={{ color: String(genreId) === String(g.id) ? '#07101a' : '#fff' }}>
                                                        {g.name}
                                                    </div>
                                                    <div className="text-sm text-gray-400">Kategori</div>
                                                </div>
                                                <div className="text-sm font-semibold" style={{ color: String(genreId) === String(g.id) ? '#07101a' : hex }}>{g.count} buku</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </aside>

                        {/* Main book grid */}
                        <main className="md:col-span-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {books.map((book) => (
                                    <div key={book.id} className="flex flex-col gap-3">
                                        <Card title={book.title} subtitle={book.genre?.name} price={book.price} image={(book as any).image_url || null} className="group hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-400/30 hover:bg-[#232946] transition-all duration-300 border border-transparent hover:border-amber-400/60 focus-within:border-amber-400/80 focus-within:shadow-amber-400/40">
                                            <div className="text-sm text-gray-400 group-hover:text-amber-200 transition-all">{book.writer}</div>
                                            <div className="mt-2 text-sm text-gray-500 group-hover:text-amber-300 transition-all">Stok: {book.stock} • {book.condition}</div>
                                        </Card>

                                        <div className="flex gap-2">
                                            <Link to={`/books/${book.id}`} className="flex-1">
                                                <Button variant="secondary" className="w-full group-hover:shadow-amber-400/20 transition-all">Detail</Button>
                                            </Link>
                                            <Button variant="danger" onClick={() => handleDelete(book.id)} className="w-full group-hover:shadow-red-400/20 transition-all">Hapus</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </main>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-8 space-x-4">
                        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-[#232946] border border-[#393a4c] rounded text-white disabled:opacity-50 hover:bg-amber-400/20 hover:text-amber-300 transition-all">&laquo; Sebelumnya</button>
                        <span className="text-gray-300">Halaman {page} dari {totalPages}</span>
                        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 bg-[#232946] border border-[#393a4c] rounded text-white disabled:opacity-50 hover:bg-amber-400/20 hover:text-amber-300 transition-all">Selanjutnya &raquo;</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BooksListPage;