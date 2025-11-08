// backend/index.js

import express from 'express';
import cors from 'cors';
import authRoutes from './authRoutes.js';
import bookRoutes from './bookRoutes.js'; // <-- 1. TAMBAHKAN IMPORT INI
import genreRoutes from './genreRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); // <-- 2. TAMBAHKAN BARIS INI
app.use('/api/genres', genreRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded/static assets
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));

app.listen(port, () => {
    console.log(`🚀 Server Backend berjalan di http://localhost:${port}`);
    console.log('Server ini siap menerima data dari Frontend React Anda.');
});