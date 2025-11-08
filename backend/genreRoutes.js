import express from 'express';
import fs from 'fs';
const router = express.Router();

const BOOKS_DB_PATH = './books.json';

function loadBooksSafe() {
    try {
        const data = fs.readFileSync(BOOKS_DB_PATH, 'utf8');
        const books = JSON.parse(data);
        return books;
    } catch (err) {
        return [];
    }
}

// GET /api/genres -> return unique genres with counts
router.get('/', (req, res) => {
    // Static genre list (with optional counts from existing books)
    const staticGenres = [
        { id: 1, name: 'Programming' },
        { id: 2, name: 'Design' },
        { id: 3, name: 'Business' },
        { id: 4, name: 'Fiction' },
        { id: 5, name: 'Education' },
        { id: 6, name: 'History' },
        { id: 7, name: 'Science' },
        { id: 8, name: 'Art' },
        { id: 9, name: 'Children' }
    ];

    // compute counts based on books.json
    const books = loadBooksSafe();
    const counts = {};
    for (const b of books) {
        if (b.genre && b.genre.id) {
            counts[b.genre.id] = (counts[b.genre.id] || 0) + 1;
        }
    }

    const genres = staticGenres.map(g => ({ ...g, count: counts[g.id] || 0 }));
    res.status(200).json(genres);
});

export default router;
