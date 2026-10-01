# PRD — Connect

**Product Requirements Document**
Versi: 0.1 (Draft)

---

## 1. Ringkasan Produk

**Nama Proyek:** Connect

**Deskripsi:**
Connect adalah aplikasi yang menjembatani pasien fisioterapi mandiri di rumah dengan tenaga kesehatan (nakes) yang menanganinya. Aplikasi ini memastikan nakes dapat memonitoring secara objektif apakah pasien benar-benar menjalani terapi sesuai jadwal, serta membantu pasien menilai kebenaran gerakan terapi secara real-time lewat sensor gyroscope pada smartphone.

**Masalah yang diselesaikan:**
- Nakes tidak punya visibilitas terhadap kepatuhan dan kebenaran gerakan pasien yang menjalani fisioterapi mandiri di rumah
- Pasien tidak punya cara mengetahui apakah gerakan terapi yang mereka lakukan sendiri sudah benar
- Komunikasi keluhan lanjutan dari pasien ke nakes tidak terstruktur dan memakan waktu konsultasi

---

## 2. Target Pengguna

**Target utama:** Fasilitas kesehatan di Indonesia (puskesmas, klinik fisioterapi, rumah sakit) beserta pasien rawat jalan/rawat mandiri yang menjalani program fisioterapi di rumah.

**Dua role pengguna:**
| Role | Deskripsi |
|---|---|
| **Pasien** | Pengguna yang menjalani program fisioterapi mandiri di rumah |
| **Nakes** | Tenaga kesehatan (dokter/fisioterapis) yang memberi resep terapi dan memonitoring progres pasien |

---

## 3. Tujuan Produk

- Memberi nakes data objektif dan terukur mengenai kepatuhan serta kualitas gerakan terapi pasien di rumah
- Memberi pasien panduan real-time agar gerakan terapi yang dilakukan sendiri sesuai anjuran
- Menyederhanakan komunikasi keluhan pasien ke nakes lewat perantara AI, tanpa menggantikan keputusan medis nakes

---

## 4. Fitur Utama

### 4.1 Autentikasi
- Login/register dengan dua role: **Pasien** dan **Nakes**
- Setiap role memiliki akses dan tampilan (dashboard/menu) yang berbeda sesuai hak aksesnya

---

### 4.2 Fitur Pasien

| # | Fitur | Deskripsi |
|---|---|---|
| P1 | **Pendeteksi Gerakan Berbasis Gyroscope** | Pasien menempelkan HP pada anggota tubuh yang diterapi. Sensor gyroscope membaca sudut gerakan secara real-time dan memberi umpan balik apakah gerakan sudah sesuai target yang ditentukan nakes |
| P2 | **Jadwal Minum Obat** | Pengingat jadwal minum obat sesuai resep nakes, dengan konfirmasi dari pasien setelah diminum |
| P3 | **Jadwal Terapi** | Pengingat jadwal sesi terapi yang harus dilakukan, sesuai resep dari nakes |
| P4 | **Riwayat Terapi** | Log hasil terapi dari waktu ke waktu (sudut yang dicapai, jumlah repetisi valid, tren kemajuan) yang terdeteksi lewat gyroscope |
| P5 | **Catatan Nakes untuk Pasien** | Pasien dapat membaca catatan/arahan yang dituliskan nakes untuknya |
| P6 | **AI Chatbot Penjembatan** | Pasien dapat menyampaikan keluhan lewat chat dengan AI. AI merangkum percakapan menjadi ringkasan terstruktur dan mengirimkannya ke dashboard nakes untuk ditindaklanjuti |

---

### 4.3 Fitur Nakes

| # | Fitur | Deskripsi |
|---|---|---|
| N1 | **Dashboard Analitik** | Menampilkan data pemantauan seluruh pasien binaan: kepatuhan jadwal terapi, kepatuhan obat, dan tren kemajuan gerakan dari data gyroscope |
| N2 | **Catatan Nakes untuk Pasien** | Nakes dapat menuliskan catatan, arahan, atau penyesuaian terapi untuk pasien tertentu |
| N3 | **Menjawab Keluhan Lanjutan** | Nakes membaca ringkasan keluhan pasien yang sudah dirangkum AI, lalu memberikan jawaban/saran lanjutan kepada pasien |

---

## 5. Alur Pengguna (User Flow) Singkat

**Alur Pasien:**
1. Login sebagai Pasien
2. Lihat jadwal terapi & obat hari ini
3. Jalankan sesi terapi → tempel HP ke anggota tubuh → sistem baca gyroscope → feedback real-time → hasil tersimpan ke riwayat
4. (Opsional) Buka AI chatbot jika ada keluhan → AI merangkum → terkirim ke nakes
5. Lihat catatan dari nakes

**Alur Nakes:**
1. Login sebagai Nakes
2. Lihat dashboard analitik seluruh pasien binaan
3. Buka profil pasien tertentu → lihat riwayat terapi, kepatuhan, dan ringkasan keluhan dari AI
4. Tuliskan catatan/arahan atau jawab keluhan pasien

---

## 6. Batasan dan Disclaimer

- Aplikasi ini adalah **alat bantu pemantauan**, bukan alat diagnosis, dan tidak menggantikan keputusan klinis nakes
- AI chatbot **tidak memberikan diagnosis atau saran medis langsung**; perannya terbatas pada menggali informasi keluhan pasien dan merangkumnya untuk nakes
- Hasil deteksi gyroscope adalah estimasi sudut gerakan, bukan pengukuran presisi klinis setara alat goniometer profesional
- Resep terapi (jenis gerakan, target sudut, jadwal) ditentukan oleh nakes, bukan oleh sistem atau pasien sendiri

---

## 7. Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | Python — FastAPI |
| Autentikasi | OAuth2 dengan JWT 
| AI LLM | GEMINI API
| *(Frontend/stack lain menyusul ditentukan tim)* | — |

---

## 8. Kebutuhan Data (Gambaran Awal Entitas)

- `users` (role: pasien / nakes)
- `patient_profile`
- `therapy_prescription` (resep terapi dari nakes: jenis gerakan, target sudut, jadwal, repetisi)
- `therapy_sessions` (hasil tiap sesi terapi dari data gyroscope)
- `medication_schedule` & `medication_logs`
- `nakes_notes`
- `chat_summaries` (ringkasan AI untuk nakes)

---

## 9. Out of Scope (Belum dikerjakan di versi ini)

- Integrasi dengan sistem kesehatan nasional (SATUSEHAT)
- Modul skrining penyakit lain di luar fisioterapi
- Akses untuk caregiver/keluarga
- Notifikasi otomatis proaktif untuk nakes (saat ini nakes mengecek dashboard secara manual)

---

## 10. Metrik Keberhasilan (Sementara)

- Jumlah sesi terapi yang berhasil direkam dan tervalidasi gyroscope
- Tingkat kepatuhan jadwal terapi & obat pasien
- Waktu respons nakes terhadap ringkasan keluhan dari AI

---