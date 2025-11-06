// backend/authRoutes.js

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs'; // <-- 1. Impor File System

const router = express.Router();

// Tentukan path ke file database Anda
const USERS_DB_PATH = './users.json';

// Kunci rahasia Anda
const JWT_SECRET = 'KUNCI_RAHASIA_SANGAT_PENTING_INI_JANGAN_DIBAGI';

// ==========================================================
// --- "DATABASE" PENGGUNA (dari file JSON) ---
let users = []; // Tetap sebagai array di memori

// 2. Fungsi untuk memuat data dari file saat server start
function loadUsers() {
    try {
        // Coba baca file
        const data = fs.readFileSync(USERS_DB_PATH, 'utf8');
        // Ubah data JSON (teks) menjadi array JavaScript
        users = JSON.parse(data);
        console.log(`Berhasil memuat ${users.length} pengguna dari users.json`);
    } catch (err) {
        // Jika file tidak ada, biarkan array 'users' kosong
        console.log('File users.json tidak ditemukan. Akan dibuat baru saat ada registrasi.');
        users = [];
    }
}

// 3. Fungsi untuk menyimpan data ke file
function saveUsers() {
    try {
        // Ubah array 'users' menjadi teks JSON yang rapi
        const data = JSON.stringify(users, null, 2);
        // Tulis data ke file
        fs.writeFileSync(USERS_DB_PATH, data);
        console.log('Database users.json berhasil diperbarui.');
    } catch (err) {
        console.error('Gagal menyimpan ke users.json:', err);
    }
}

// Panggil fungsi load saat server pertama kali dijalankan
loadUsers();
// ==========================================================


/**
 * RUTE: POST /api/auth/register
 */
router.post('/register', async (req, res) => {
    console.log('Menerima permintaan ke /api/auth/register');
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Semua field tidak boleh kosong.' });
        }

        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: hashedPassword,
        };

        // Tambahkan ke array
        users.push(newUser);

        // 4. PANGGIL FUNGSI UNTUK MENYIMPAN KE FILE
        saveUsers();

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({
            token: token,
            user: {
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (error) {
        console.error('Error di register:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});


/**
 * RUTE: POST /api/auth/login
 * (Tidak ada perubahan di sini, karena login hanya membaca)
 */
router.post('/login', async (req, res) => {
    console.log('Menerima permintaan ke /api/auth/login');
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password tidak boleh kosong.' });
        }

        // 'users' sudah diisi oleh loadUsers()
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Email atau password salah.' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Email atau password salah.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h',
        });

        console.log('Login berhasil untuk:', user.email);

        res.status(200).json({
            token: token,
            user: {
                email: user.email,
            },
        });

    } catch (error) {
        console.error('Error di login:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});

export default router;