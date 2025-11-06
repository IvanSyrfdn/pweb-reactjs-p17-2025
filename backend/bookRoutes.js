// backend/bookRoutes.js

import express from 'express';
import fs from 'fs'; // <-- 1. Impor File System
const router = express.Router();

const BOOKS_DB_PATH = './books.json';

// ==========================================================
// --- "DATABASE" BUKU (dari file JSON) ---
let books = [];

// 2. Fungsi untuk memuat data dari file
function loadBooks() {
    try {
        const data = fs.readFileSync(BOOKS_DB_PATH, 'utf8');
        books = JSON.parse(data);

        // Jika file ada tapi kosong, isi dengan data contoh
        if (books.length === 0) {
            throw new Error('File kosong, muat data contoh.');
        }
        console.log(`Berhasil memuat ${books.length} buku dari books.json`);
    } catch (err) {
        // Jika file tidak ada atau error, buat data contoh
        console.log('File books.json tidak ditemukan/kosong. Memuat data contoh...');
        books = [
            {
                id: 1,
                title: "Buku React untuk Pemula",
                writer: "Han Solo",
                publisher: "Penerbit IT-Lit",
                price: 150000,
                stock: 20,
                genre: { id: 1, name: "Programming" },
                condition: "Baru",
                publication_year: 2024,
                description: "Buku panduan lengkap React."
            },
            {
                id: 2,
                title: "Node.js di Balik Layar",
                writer: "Leia Organa",
                publisher: "Penerbit IT-Lit",
                price: 145000,
                stock: 15,
                genre: { id: 1, name: "Programming" },
                condition: "Baru",
                publication_year: 2023,
                description: "Memahami cara kerja Node.js."
            }
        ];
        // Langsung simpan data contoh ke file baru
        saveBooks();
    }
}

// 3. Fungsi untuk menyimpan data ke file
function saveBooks() {
    try {
        const data = JSON.stringify(books, null, 2);
        fs.writeFileSync(BOOKS_DB_PATH, data);
        console.log('Database books.json berhasil diperbarui.');
    } catch (err) {
        console.error('Gagal menyimpan ke books.json:', err);
    }
}

// Panggil fungsi load saat server pertama kali dijalankan
loadBooks();
// ==========================================================


/**
 * RUTE: GET /api/books
 * Tugas: Mengirimkan daftar semua buku (sudah lengkap dengan search, filter, sort)
 */
router.get('/', (req, res) => {
    console.log('Menerima permintaan GET /api/books');

    const { search, condition, sort, page = 1, limit = 8 } = req.query;

    let filteredBooks = [...books];

    // 1. Filter (Search)
    if (search) {
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.writer.toLowerCase().includes(search.toLowerCase())
        );
    }

    // 2. Filter (Kondisi)
    if (condition) {
        filteredBooks = filteredBooks.filter(book => book.condition === condition);
    }

    // 3. Sort
    if (sort) {
        const [key, order] = sort.split(':'); // misal: "title:asc"
        filteredBooks.sort((a, b) => {
            if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // 4. Pagination
    const totalBooks = filteredBooks.length;
    const totalPages = Math.ceil(totalBooks / limit);
    const startIndex = (page - 1) * limit;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + limit);

    // Kirim respons sesuai format PaginatedResponse
    res.status(200).json({
        data: paginatedBooks,
        meta: {
            total: totalBooks,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: totalPages
        }
    });
});

/**
 * RUTE: POST /api/books
 * Tugas: Menerima data dari AddBookPage.tsx dan menambah buku baru
 */
router.post('/', (req, res) => {
    console.log('Menerima permintaan POST /api/books');
    try {
        const { title, writer, price, stock, genreId, condition, publisher, publication_year, description } = req.body;

        // (Validasi sederhana)
        if (!title || !writer || !price || !stock || !genreId) {
            return res.status(400).json({ message: "Field wajib (Judul, Penulis, Harga, Stok, Genre) harus diisi." });
        }

        // (Simulasi mengambil data genre, di backend nyata ini akan query ke tabel genre)
        const genreMap = { 1: "Programming", 2: "Design", 3: "Business" };

        const newBook = {
            id: Date.now(), // ID unik
            title,
            writer,
            price: Number(price),
            stock: Number(stock),
            genre: { id: Number(genreId), name: genreMap[genreId] || "Lainnya" },
            condition,
            publisher,
            publication_year: Number(publication_year),
            description
        };

        // Tambahkan buku baru ke array
        books.push(newBook);

        // 4. SIMPAN PERUBAHAN KE FILE
        saveBooks();

        res.status(201).json(newBook);

    } catch (error) {
        console.error("Error di POST /api/books:", error);
        res.status(500).json({ message: "Server error" });
    }
});


/**
 * RUTE: DELETE /api/books/:id
 * Tugas: Menghapus buku berdasarkan ID
 */
router.delete('/:id', (req, res) => {
    console.log(`Menerima permintaan DELETE /api/books/${req.params.id}`);
    try {
        const bookId = parseInt(req.params.id);

        const bookIndex = books.findIndex(b => b.id === bookId);

        if (bookIndex === -1) {
            return res.status(404).json({ message: "Buku tidak ditemukan" });
        }

        // Hapus buku dari array
        books.splice(bookIndex, 1);

        // 5. SIMPAN PERUBAHAN KE FILE
        saveBooks();

        res.status(200).json({ message: "Buku berhasil dihapus" });

    } catch (error) {
        console.error(`Error di DELETE /api/books/${req.params.id}:`, error);
        res.status(500).json({ message: "Server error" });
    }
});

// Anda juga perlu rute GET /api/books/:id untuk halaman detail
router.get('/:id', (req, res) => {
    console.log(`Menerima permintaan GET /api/books/${req.params.id}`);
    try {
        const bookId = parseInt(req.params.id);
        const book = books.find(b => b.id === bookId);

        if (!book) {
            return res.status(404).json({ message: "Buku tidak ditemukan" });
        }

        res.status(200).json(book);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;