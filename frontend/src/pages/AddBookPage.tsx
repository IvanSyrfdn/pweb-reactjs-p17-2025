// src/pages/AddBookPage.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookApi, genreApi } from '../services/api';
import type { Genre } from '../services/types';

const AddBookPage: React.FC = () => {
    const navigate = useNavigate();

    // States untuk Form
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [publisher, setPublisher] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [genreId, setGenreId] = useState(''); // Simpan ID genre
    const [condition, setCondition] = useState<'Baru' | 'Bekas'>('Baru');
    const [publication_year, setPublicationYear] = useState(new Date().getFullYear());

    const [genres, setGenres] = useState<Genre[]>([]); // Untuk dropdown
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Genres untuk Dropdown
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await genreApi.getAll();
                setGenres(data);
                if (data.length > 0) {
                    setGenreId(data[0].id.toString()); // Set default value
                }
            } catch (err) {
                setError("Gagal memuat data genre.");
            }
        };
        fetchGenres();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validasi Sisi Client
        if (!title || !writer || price <= 0 || stock < 0 || !genreId) {
            setError("Field Wajib (Judul, Penulis, Harga, Stok, Genre) harus valid.");
            return;
        }

        setIsLoading(true);
        try {
            const newBookData = {
                title,
                writer,
                publisher,
                description,
                price,
                stock,
                genreId: Number(genreId), // Pastikan jadi angka
                condition,
                publication_year,
            };

            await bookApi.create(newBookData);

            alert("Buku baru berhasil ditambahkan!");
            navigate('/'); // Kembali ke halaman list buku

        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal menambahkan buku.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl text-left">
            <h1 className="text-3xl font-bold mb-6 text-white">Tambah Buku Baru</h1>

            <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">

                {error && (
                    <div className="bg-red-200 border border-red-500 text-red-800 px-4 py-3 rounded mb-4" role="alert">
                        {error}
                    </div>
                )}

                {/* Grid untuk layout form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="title">Judul Buku *</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="writer">Penulis *</label>
                            <input type="text" id="writer" value={writer} onChange={e => setWriter(e.target.value)} className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="publisher">Penerbit</label>
                            <input type="text" id="publisher" value={publisher} onChange={e => setPublisher(e.target.value)} className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="publication_year">Tahun Terbit</label>
                            <input type="number" id="publication_year" value={publication_year} onChange={e => setPublicationYear(Number(e.target.value))} className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white" />
                        </div>
                    </div>

                    {/* Kolom Kanan */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="genre">Genre *</label>
                            <select id="genre" value={genreId} onChange={e => setGenreId(e.target.value)} className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white">
                                {genres.length === 0 ? (
                                    <option disabled>Loading genres...</option>
                                ) : (
                                    genres.map(genre => (
                                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="price">Harga *</label>
                            <input type="number" id="price" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="stock">Stok *</label>
                            <input type="number" id="stock" value={stock} onChange={e => setStock(Number(e.target.value))} className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="condition">Kondisi *</label>
                            <select id="condition" value={condition} onChange={e => setCondition(e.target.value as 'Baru' | 'Bekas')} className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white">
                                <option value="Baru">Baru</option>
                                <option value="Bekas">Bekas</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Deskripsi (full width) */}
                <div className="mb-6">
                    <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="description">Deskripsi</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full p-3 border border-gray-700 rounded bg-gray-900 text-white"></textarea>
                </div>

                <div className="flex items-center justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Buku'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBookPage;