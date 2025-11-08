| Nama                        | NRP        |
| --------------------------- | ---------- |
| Hansen Chang                | 5027241028 |
| Ivan Syarifuddin            | 5027241045 |
| Muhammad Khosyi Syehab      | 5027241089 |

## How to Start

### 1. BackEnd

```
npm install
npm start
```

### 2. FrontEnd
> (di terminal yang berbeda)

```
npm install
npm run dev
```

### Status fitur (singkat, berdasarkan kode saat ini)
#### Autentikasi (backend)

Status: Ada route backend terdaftar (/api/auth) — lihat index.js.
Bukti: index.js memuat authRoutes dan mendaftarkan app.use('/api/auth', authRoutes).
Catatan: saya belum memeriksa isi authRoutes (tapi route ada).

#### Proteksi halaman (frontend)
Status: Belum lengkap / perlu pengecekan.
Bukti: AddBookPage saat ini adalah halaman biasa dan tidak menunjukkan pemeriksaan token saat mount. Jadi AddBook tampaknya dapat diakses publik kecuali Anda sudah membungkus route ini dengan guard di routing (saya belum membaca file routing utama justru).
Saran: Bungkus AddBookPage di ProtectedRoute / cek auth context & interceptor token.

#### Manajemen buku: list / detail / create / delete
Status: Backend: lengkap (GET list with search/filter/sort/pagination, GET/:id, POST, DELETE). Frontend: sebagian besar sudah ter-wired.
Bukti backend: bookRoutes.js — ada:
GET /api/books dengan query search, condition, sort, page, limit, genreId.
POST /api/books (menerima image_url dan menyimpan ke books.json).
DELETE /:id.
GET /:id.
Bukti frontend: AddBookPage.tsx mengirim POST (memanggil bookApi.create) dan menampilkan preview cover; BookList/Detail yang Anda ubah sebelumnya juga menampilkan cover ( berdasarkan rangkuman pekerjaan sebelumnya ).

#### Upload cover image & static assets
Status: Sudah di-backend.
Bukti: uploadRoutes.js pakai multer, menyimpan ke folder assets dan merespon { url }; index.js melayani /assets statis.
Bukti frontend: AddBookPage.tsx memakai /api/upload (fetch POST FormData), menyimpan image_url dari respons dan menampilkan preview.

##### Genre (kategori)
Status: Ada route genre di backend (/api/genres) dan frontend mengambil genre untuk dropdown di AddBookPage.
Bukti: index.js mendaftarkan genreRoutes; AddBookPage memanggil genreApi.getAll() dan menampilkan select.

#### Pencarian / filter / sort / pagination
Status: Backend: disediakan (lihat query params di bookRoutes.js). Frontend: pencarian & genre-filter sudah ada/di-wired (sebagaimana Anda/ saya edit BookListPage), pagination UI perlu dikonfirmasi (backend mendukung pagination lewat page/limit).
Bukti: bookRoutes.js menghitung pagination (meta: total, page, limit, totalPages).

#### Transaksi (list / create / detail)
Status: Belum terlihat / belum diimplementasikan.
Bukti: Tidak ada file routes atau pages transaksi yang saya temukan dalam pengecekan singkat ini.
Saran: Tambah route backend (/api/transactions) + halaman frontend (buat checkout, list transaksi).

#### UX states (loading / error / empty)
Status: Sebagian ada.
Bukti: AddBookPage.tsx menangani isLoading, isUploading, error dan menampilkan pesan. Komponen Loading/Empty/Error ada di project (berdasarkan rangkuman sebelumnya).
Saran: Pastikan BookList dan BookDetail juga menampilkan loading/empty/error yang jelas.

#### Validasi client-side
Status: Ada validasi dasar di AddBookPage:
Harga dan stok diinput sebagai teks lalu diparse.
Cek publication_year > 2025 sudah ada.
Required fields (title, writer, genre, price, stock) divalidasi.
Required fields diberi asterisk merah di label.
Bukti: lihat AddBookPage.tsx (validasi dan asterisk merah).

#### Responsiveness
Status: Dasar responsive disediakan (Tailwind + grid di form & list), namun butuh pengujian visual pada beberapa viewport.
Saran: Uji di mobile/emulator dan perbaiki grid/spacing jika perlu.

#### Build / Run
Status: Anda sudah menjalankan npm install di frontend & backend dan npm run build di frontend (berdasarkan konteks terminal). Backend membutuhkan npm start agar route upload & assets benar-benar aktif.

### Checklist cepat (dari soal) — ringkasan PASS / TODO
[PASS] GET /api/books (search/filter/sort/pagination) — backend ada.
[PASS] GET /api/books/:id (detail) — backend ada.
[PASS] POST /api/books (create with image_url) — backend + frontend AddBook wired.
[PASS] DELETE /api/books/:id — backend ada.
[PASS] Upload cover + static assets — backend uploadRoutes.js & static serve in index.js; AddBook uploads to /api/upload.
[PASS] Genre list + dropdown — backend genres route registered; AddBook fetches genres.
[PARTIAL] Frontend protections/auth — backend has authRoutes but frontend protected routing / login/register flow needs review/confirmation (likely partial or absent).
[MISSING] Transactions (backend + frontend) — belum ada.
[PARTIAL] Pagination UI / controls on frontend — backend supports pagination; UI needs confirmation/possible implementation.
[PASS] Client validation & publication_year <= 2025 — implemented in AddBookPage.
[PARTIAL] Loading / error states — AddBook has them; check BookList / BookDetail for consistent UX.
[PARTIAL] Full assignment polish (Gramedia-like visuals, carousels, wishlist, ratings) — mostly UI improvements done but more polish optional.