// src/pages/BookDetailPage.tsx
import EmptyState from '../components/emptyState'; // Sesuaikan nama jika beda
import React, { useState, useEffect } from 'react';
import Button from '../components/button';
import { useParams, useNavigate } from 'react-router-dom';
import { bookApi } from '../services/api';
import type { Book } from '../services/types';
import { useCart } from '../contexts/CartContext';

// (Ganti dengan komponen Anda)
const LoadingSpinner: React.FC = () => <p className="text-white">Loading...</p>;
const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => <p className="text-red-400">Error: {message}</p>;

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Ambil 'id' dari URL
    const navigate = useNavigate();
    const { addToCart } = useCart(); // Ambil fungsi 'addToCart'

    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1); // State untuk jumlah pembelian

    useEffect(() => {
        if (!id) return;

        const fetchBook = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await bookApi.getById(id);
                setBook(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Buku tidak ditemukan.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleAddToCart = () => {
        if (book) {
            if (quantity > book.stock) {
                alert("Jumlah melebihi stok!");
                return;
            }
            addToCart(book, quantity);
            alert(`${quantity} ${book.title} ditambahkan ke keranjang!`);
            navigate('/cart'); // Langsung arahkan ke keranjang
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!book) return <EmptyState message="Buku tidak ditemukan." />;

    return (
        <div className="container mx-auto max-w-4xl text-left px-4">
            <button onClick={() => navigate(-1)} className="mb-4 text-amber-300 hover:text-amber-200">
                &laquo; Kembali ke daftar
            </button>

            <div className="bg-gray-900 shadow-lg rounded-lg p-6">
                <h1 className="text-4xl font-bold mb-4 text-white">{book.title}</h1>
                <p className="text-xl text-gray-400 mb-2">oleh {book.writer}</p>

                <p className="text-2xl font-semibold text-amber-400 mb-4">
                    Rp {book.price.toLocaleString('id-ID')}
                </p>

                {/* Info Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-300">
                    <p><strong>Penerbit:</strong> {book.publisher || '-'}</p>
                    <p><strong>Tahun Terbit:</strong> {book.publication_year || '-'}</p>
                    <p><strong>Genre:</strong> {book.genre.name}</p>
                    <p><strong>Kondisi:</strong> {book.condition || '-'}</p>
                    <p><strong>Stok:</strong> {book.stock} pcs</p>
                    <p><strong>ISBN:</strong> {book.isbn || '-'}</p>
                </div>

                <p className="text-gray-300 mb-6">
                    <strong>Deskripsi:</strong><br />
                    {book.description || 'Tidak ada deskripsi.'}
                </p>

                {/* Aksi: Tambah ke Keranjang */}
                <div className="flex items-center gap-4 border-t border-gray-800 pt-6">
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        min="1"
                        max={book.stock}
                        className="w-20 p-2 border border-gray-700 rounded bg-gray-900 text-white"
                    />
                    <Button onClick={handleAddToCart} disabled={book.stock === 0} variant="primary">
                        {book.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;