// src/services/types.ts

// Tipe untuk error API
export interface ApiError {
    message: string;
}

// Tipe untuk data Genre
export interface Genre {
    id: number; // atau string, sesuaikan dengan API Anda
    name: string;
}

// Tipe untuk data Buku
// (Tambahkan field opsional sesuai soal: isbn, publication_year, dll.)
export interface Book {
    id: number; // atau string
    title: string;
    writer: string;
    publisher?: string;
    price: number;
    stock: number;
    genre: Genre; // API Anda harus me-relasikan genre
    condition: 'Baru' | 'Bekas';
    publication_year?: number;
    description?: string;
    isbn?: string;
    image_url?: string | null;
}

// Tipe untuk respons paginasi (untuk list buku/transaksi)
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Tipe untuk Item dalam Transaksi (detail)
export interface TransactionItem {
    id: number; // atau string
    book: Book; // Detail buku saat itu
    quantity: number;
    priceAtPurchase: number; // Harga buku saat transaksi
}

// Tipe untuk Transaksi (list & detail)
export interface Transaction {
    id: number; // atau string
    userId: number; // atau string
    totalPrice: number;
    totalItems: number; // Sesuai soal: 'amount'
    status: string; // misal: 'pending', 'completed'
    createdAt: string; // ISO date string
    items: TransactionItem[]; // Detail item
}

// Tipe untuk request 'Buat Transaksi' (dikirim ke API)
export interface CreateTransactionRequest {
    items: Array<{
        bookId: number | string; // ID buku
        quantity: number;
    }>;
}