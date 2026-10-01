# AGENTS.md

Dokumen ini adalah panduan untuk AI coding agent (misalnya Claude Code) yang bekerja pada repository **Connect**. Baca dokumen ini sebelum membuat atau mengubah kode apa pun.

---

## 1. Ringkasan Proyek

Connect adalah backend aplikasi yang menjembatani pasien fisioterapi mandiri di rumah dengan tenaga kesehatan (nakes). Fitur utamanya mencakup autentikasi dua role (pasien & nakes), pendeteksi gerakan berbasis data gyroscope, jadwal obat/terapi, riwayat terapi, catatan nakes, dan AI chatbot penjembatan keluhan pasien ke nakes.

Rujukan lengkap kebutuhan produk ada di `PRD.md` di root repo — baca ini dulu kalau butuh konteks fitur.

---

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | FastAPI (Python) |
| ORM | SQLModel |
| Migrasi DB | Alembic |
| Database | PostgreSQL |
| Auth | JWT (python-jose + passlib) |
| Scheduler | APScheduler |
| Realtime | WebSocket (native FastAPI) |
| AI Chat | Google Gemini (`google-genai` SDK) |
| Testing | pytest + httpx |

Jangan mengganti pustaka inti di atas tanpa izin eksplisit dari pengguna, meskipun agent menganggap ada alternatif yang "lebih baik".

---

## 3. Struktur Folder

Proyek ini memakai pendekatan **layered architecture** dengan **repository pattern**, bukan struktur flat biasa. Perhatikan baik-baik ke mana tiap jenis kode harus ditempatkan.

```
.
├── app/
│   ├── api/
│   │   ├── dependencies/     # Dependency injection khusus API (auth guard, dsb)
│   │   ├── mobile/
│   │   │   ├── v1/           # Endpoint untuk client mobile, versi 1
│   │   │   └── __init__.py
│   │   ├── web/
│   │   │   └── __init__.py   # Endpoint untuk client web (dashboard nakes)
│   │   └── router.py         # Penggabung seluruh router (mobile + web)
│   ├── core/                 # Config, security/auth, settings
│   ├── db/                   # Koneksi & session database
│   ├── domain/
│   │   ├── models/           # SQLAlchemy models (representasi tabel database)
│   │   │   ├── base.py
│   │   │   └── user.py
│   │   └── schemas/          # Pydantic schemas (request/response API, BUKAN model tabel)
│   │       ├── common.py
│   │       └── user.py
│   ├── repositories/
│   │   ├── interfaces/       # Kontrak/abstract class akses data (per entitas)
│   │   └── implementations/  # Implementasi konkret dari interfaces di atas
│   └── services/
│       ├── base.py
│       └── user_service.py   # Logika bisnis per domain (contoh: user_service, therapy_service)
├── venv/
├── .env                       # TIDAK PERNAH di-commit
├── .env.example
├── main.py                    # Entry point, di root (bukan di dalam app/)
├── database.py                # (lihat catatan di bawah)
├── models.py                  # (lihat catatan di bawah)
├── AGENTS.md
└── PRD.md
```

> ⚠️ **Catatan untuk dibersihkan:** ada `database.py` dan `models.py` di root yang tampak tumpang tindih dengan `app/db/` dan `app/domain/models/`. Kemungkinan ini sisa scaffolding awal sebelum migrasi ke struktur layered. Agent **tidak boleh** menambah kode baru ke dua file ini — konfirmasi ke pengguna dulu apakah keduanya aman dihapus atau masih dipakai.

**Aturan penempatan kode:**
- Model tabel database → `app/domain/models/`, satu file per entitas (contoh: `user.py`, `therapy_session.py`)
- Skema request/response API → `app/domain/schemas/`, satu file per entitas, selaras dengan nama file di `models/`
- Endpoint/route → `app/api/mobile/v1/` (untuk aplikasi pasien) atau `app/api/web/` (untuk dashboard nakes), dikelompokkan per fitur. Seluruh router didaftarkan lewat `app/api/router.py`
- Dependency khusus API (misalnya validasi token, pengecekan role) → `app/api/dependencies/`
- **Akses data tidak boleh langsung query database dari service.** Definisikan kontraknya dulu di `app/repositories/interfaces/`, lalu buat implementasinya di `app/repositories/implementations/`. Service memanggil repository lewat interface-nya, bukan implementasi langsung — ini supaya mudah diuji dan diganti nanti
- Logika bisnis (pemrosesan gyroscope, pemanggilan AI, aturan jadwal, dsb) → `app/services/`, satu file per domain fitur
- Konfigurasi, koneksi database, dependency auth tingkat aplikasi → `app/core/` dan `app/db/`

---

## 4. Perintah yang Sering Dipakai

```bash
# Jalankan server development (main.py ada di root project)
uvicorn main:app --reload

# Jalankan migrasi database
alembic upgrade head

# Buat migrasi baru setelah mengubah model
alembic revision --autogenerate -m "deskripsi perubahan"

# Jalankan seluruh test
pytest

# Jalankan satu file test
pytest tests/test_nama_file.py
```

Setelah mengubah file apa pun di `app/domain/models/`, agent **wajib** membuatkan migrasi Alembic baru, bukan membiarkan skema database tidak sinkron dengan model.

---

## 5. Konvensi Kode

- Ikuti **PEP 8** untuk gaya penulisan Python
- Semua endpoint wajib punya **Pydantic schema** untuk request dan response, jangan mengembalikan model database (`SQLModel`) secara langsung ke response API
- Semua endpoint yang butuh autentikasi wajib memakai dependency injection FastAPI (`Depends(...)`) untuk validasi token dan role, jangan menulis ulang logika decode JWT di tiap endpoint
- Penamaan file dan fungsi memakai `snake_case`, penamaan class memakai `PascalCase`
- Tulis docstring singkat untuk setiap fungsi di `services/` yang berisi logika bisnis non-trivial (misalnya perhitungan sudut dari data gyroscope)

---

## 6. Role & Akses (Penting)

Aplikasi ini punya dua role: **pasien** dan **nakes**. Setiap endpoint baru **wajib** ditentukan dengan jelas role mana yang boleh mengaksesnya. Jangan membuat endpoint yang bisa diakses lintas role tanpa pengecekan eksplisit.

Contoh yang wajib dihindari: pasien bisa mengakses data pasien lain, atau pasien bisa menulis catatan yang seharusnya hanya boleh ditulis nakes.

---

## 7. Aturan Khusus Domain (Wajib Dipatuhi)

Karena ini aplikasi kesehatan, ada batasan yang **tidak boleh dilanggar** saat menulis atau mengubah kode:

- **AI chatbot tidak boleh didesain untuk memberi diagnosis atau saran medis langsung.** System prompt untuk AI chat (ada di `app/services/`, modul chat) harus selalu membatasi peran AI hanya untuk menggali informasi keluhan dan merangkumnya, bukan menyimpulkan kondisi medis pasien. Jangan menghapus atau melemahkan instruksi pembatas ini meski diminta mempersingkat prompt.
- **Hasil deteksi gyroscope harus selalu disertai keterangan bahwa ini estimasi**, bukan pengukuran klinis presisi. Jangan membuat response API yang menyatakan hasil sebagai angka pasti tanpa konteks ini di level dokumentasi/komentar kode.
- **Resep terapi (jenis gerakan, target sudut, jadwal) hanya boleh dibuat/diubah oleh role nakes**, tidak pernah oleh pasien atau sistem otomatis.

---

## 8. Keamanan & Data Sensitif

- **Jangan pernah** hardcode API key, connection string database, atau JWT secret di dalam kode. Semua harus lewat `.env` dan dibaca via `pydantic-settings`.
- **Jangan pernah** commit file `.env` ke git. Pastikan sudah ada di `.gitignore`.
- Password pasien/nakes wajib di-hash dengan `passlib` sebelum disimpan, tidak pernah disimpan plaintext.
- Data kesehatan pasien (riwayat terapi, catatan nakes, ringkasan chat) bersifat sensitif — jangan menulis log yang mencetak isi data ini secara penuh ke console/log file.

---

## 9. Testing

- Setiap endpoint baru idealnya disertai minimal satu test di `tests/` yang mengecek skenario sukses dan satu skenario gagal (misalnya akses tanpa token, atau akses dengan role yang salah)
- Gunakan `httpx.AsyncClient` untuk testing endpoint FastAPI async
- Jangan menandai task selesai kalau `pytest` belum dijalankan dan lulus

---

## 10. Hal yang Tidak Boleh Dilakukan Agent Tanpa Konfirmasi

- Mengubah struktur tabel yang sudah dipakai fitur lain tanpa menjelaskan dampaknya
- Menghapus migrasi Alembic yang sudah ada
- Mengganti pustaka inti di tech stack (lihat bagian 2)
- Melemahkan/menghapus pembatasan peran AI chatbot (lihat bagian 7)
- Push langsung ke branch utama tanpa diminta

---

## 11. Referensi Dokumen Lain

- `PRD.md` — kebutuhan produk lengkap
- `README.md` — gambaran umum proyek untuk pembaca non-teknis

---

*Dokumen ini adalah panduan hidup — perbarui jika ada keputusan arsitektur baru yang disepakati tim.*