# Design System --- Connect (Website Nakes)

**Produk:** Connect\
**Platform:** Website khusus tenaga kesehatan (Nakes)\
**Status:** Draft / Active Development\
**Acuan:** `PRD.md` dan `DESIGN.md` (Mobile)

Dokumen ini menetapkan aturan desain untuk website Connect yang hanya
digunakan oleh tenaga kesehatan. **Pasien menggunakan aplikasi mobile
dan tidak mengakses website ini.** Karena itu, seluruh halaman,
navigasi, dan alur website difokuskan pada kebutuhan Nakes untuk
memonitor pasien yang menjadi tanggung jawabnya, mengelola resep terapi
dan jadwal obat, membaca riwayat terapi, menulis catatan, serta meninjau
dan merespons ringkasan keluhan AI.

Website adalah client untuk backend REST API. Semua aturan autentikasi,
role, assignment pasien, dan kepemilikan data tetap ditegakkan oleh
backend. Menyembunyikan tombol di frontend bukan pengganti authorization
di server.

------------------------------------------------------------------------

## 1. Prinsip Desain

Connect adalah produk kesehatan untuk membantu Nakes memonitor pasien
yang menjalani fisioterapi mandiri di rumah. Antarmuka harus terasa:

-   **Terpercaya:** gunakan warna biru sebagai identitas utama.
-   **Mendukung progres:** hijau/toska digunakan untuk progres dan
    keberhasilan.
-   **Tenang dan terstruktur:** minimalkan dekorasi, animasi, dan visual
    yang mengganggu.
-   **Efisien untuk pekerjaan klinis:** informasi pasien, kepatuhan,
    sesi terapi, dan keluhan harus mudah dipindai.
-   **Berorientasi tugas:** tindakan penting seperti membuka detail
    pasien, membuat resep terapi, dan merespons keluhan mudah ditemukan.
-   **Responsif:** dashboard tetap dapat digunakan di desktop, tablet,
    dan browser ponsel.
-   **Menjaga privasi:** hanya tampilkan informasi pasien yang dapat
    diakses oleh Nakes yang sedang login.

### Prinsip khusus website Nakes

1.  Website ini bukan portal pasien dan tidak memiliki dashboard pasien.
2.  Jangan membuat halaman pasien untuk menjalankan terapi, mencatat
    obat, atau menggunakan AI chatbot sebagai pasien.
3.  Pasien hanya menjadi entitas yang dimonitor dan dikelola oleh Nakes
    melalui website.
4.  Prioritaskan dashboard desktop, tabel, pencarian, filter, dan detail
    pasien.
5.  Pada layar kecil, pertahankan fungsi inti melalui layout responsif.
6.  Jangan menambahkan fitur yang tidak tercantum dalam MVP PRD.

------------------------------------------------------------------------

## 2. Fondasi Visual

### 2.1 Tipografi

**Font utama: Poppins**, mengikuti desain mobile Connect agar identitas
produk tetap konsisten.

Gunakan empat weight: - `400 Regular` - `500 Medium` - `600 SemiBold` -
`700 Bold`

  -------------------------------------------------------------------------
  Token                  Desktop          Mobile Weight      Penggunaan
  -------------- --------------- --------------- ----------- --------------
  `display`          32px / 40px     28px / 36px 600         Judul
                                                             dashboard

  `h1`               24px / 32px     22px / 30px 600         Judul halaman

  `h2`               20px / 28px     18px / 26px 600         Judul
                                                             card/section

  `h3`               16px / 24px     16px / 24px 600         Subjudul

  `body`             15px / 22px     15px / 22px 400         Konten umum

  `bodyMedium`       15px / 22px     15px / 22px 500         Konten penting

  `button`           14px / 20px     16px / 20px 600         Label tombol

  `caption`          13px / 18px     13px / 18px 400         Metadata dan
                                                             timestamp

  `label`            12px / 16px     12px / 16px 500         Label form,
                                                             badge, header
                                                             tabel
  -------------------------------------------------------------------------

Format ukuran adalah `font-size / line-height`.

Aturan: - Jangan menggunakan ukuran font di luar skala ini tanpa
memperbarui dokumen. - Hindari ALL CAPS untuk label antarmuka. -
Utamakan hierarki yang jelas antara nama pasien, status, informasi
utama, dan metadata. - Teks tabel dan form harus tetap mudah dibaca.

### 2.2 Palet Warna

Pertahankan palet dari desain mobile.

#### Warna inti

  Token           Hex         Penggunaan
  --------------- ----------- -----------------------------------
  `primaryDark`   `#074173`   Sidebar, heading, teks penting
  `primary`       `#1679AB`   Tombol utama, link, kontrol aktif
  `accentTeal`    `#5DEBD7`   Indikator progres
  `accentLime`    `#C5FF95`   Badge keberhasilan kecil

#### Warna netral

  Token             Hex         Penggunaan
  ----------------- ----------- ------------------------------
  `bgBase`          `#F7FAFC`   Latar utama
  `surface`         `#FFFFFF`   Card, tabel, modal, dropdown
  `textPrimary`     `#0B2436`   Teks utama
  `textSecondary`   `#5C7A91`   Deskripsi dan metadata
  `border`          `#DCE8F0`   Border dan divider
  `disabled`        `#B8C5CE`   Kontrol nonaktif

#### Warna semantik

  Token       Hex         Penggunaan
  ----------- ----------- ---------------------------------
  `success`   `#2FAE60`   Operasi berhasil/status selesai
  `danger`    `#D64545`   Error dan tindakan destruktif
  `warning`   `#E3A008`   Peringatan non-darurat

Aturan: - Dominasi visual tetap netral, biru sebagai warna identitas,
dan hijau/toska sebagai aksen. - Jangan menggunakan `accentLime` sebagai
latar tombol besar dengan teks putih. - Status harus memiliki label
teks, bukan dibedakan dengan warna saja. - Jangan menambah warna baru
tanpa memperbarui token dan dokumen.

------------------------------------------------------------------------

## 3. Grid, Spacing, dan Layout

### 3.1 Spacing

Base unit: **4px**.

  Token           Nilai Penggunaan
  ------------- ------- -----------------------------
  `space.xs`        4px Jarak ikon dan teks
  `space.sm`        8px Jarak elemen kecil
  `space.md`       16px Padding card dan jarak form
  `space.lg`       24px Jarak section
  `space.xl`       32px Jarak besar
  `space.xxl`      48px Pemisah area besar

### 3.2 Ukuran layout

  Token                        Nilai Penggunaan
  ------------------------- -------- --------------------------------
  `contentMax`                1440px Lebar maksimum konten
  `pagePaddingDesktop`          32px Padding konten desktop
  `pagePaddingTablet`           24px Padding konten tablet
  `pagePaddingMobile`           16px Padding konten mobile
  `sidebarWidth`               248px Lebar sidebar
  `sidebarCollapsedWidth`       76px Sidebar ringkas bila digunakan
  `topbarHeight`                72px Tinggi topbar
  `cardGap`                     16px Jarak antarcard
  `sectionGap`                  24px Jarak antarsection

Gunakan grid/flex untuk layout utama. Jangan menggunakan posisi absolut
sebagai metode utama penyusunan halaman. Tabel boleh menggunakan lebar
penuh area konten, sedangkan formulir sebaiknya dibatasi pada lebar yang
nyaman dibaca.

### 3.3 Breakpoint responsif

  ---------------------------------------------------------------------
  Token                                      Lebar Perilaku
  -------------------- --------------------------- --------------------
  `mobile`                               `< 640px` Satu kolom, sidebar
                                                   menjadi drawer

  `tablet`                          `640px–1023px` Grid fleksibel,
                                                   sidebar dapat
                                                   menjadi drawer

  `desktop`                        `1024px–1279px` Sidebar dan area
                                                   konten utama

  `wide`                               `>= 1280px` Dashboard penuh
                                                   dengan tabel lebih
                                                   lebar
  ---------------------------------------------------------------------

Breakpoint dapat menyesuaikan framework, tetapi perilaku responsif harus
tetap dipertahankan.

------------------------------------------------------------------------

## 4. Radius, Border, dan Shadow

### Radius

  Token             Nilai Penggunaan
  --------------- ------- ------------------------------
  `radius.sm`         8px Input dan badge kecil
  `radius.md`        12px Tombol, dropdown, card kecil
  `radius.lg`        16px Card dan panel utama
  `radius.full`     999px Avatar dan badge pill

### Border dan shadow

-   Border standar: `1px solid #DCE8F0`.
-   Shadow card: `0 2px 8px rgba(7, 65, 115, 0.08)`.
-   Gunakan shadow tipis; jangan membuat panel dashboard tampak melayang
    berlebihan.
-   Untuk tabel, gunakan border dan divider tipis.
-   Hindari border tebal dan shadow kuat pada komponen yang sama.

------------------------------------------------------------------------

## 5. Struktur Navigasi Website Nakes

### 5.1 Layout utama

-   Sidebar navigasi di sebelah kiri.
-   Topbar pada area konten.
-   Area konten utama yang dapat di-scroll.
-   Breadcrumb untuk halaman bertingkat jika membantu orientasi.
-   Menu akun dan logout di topbar atau menu profil.

### 5.2 Navigasi utama

Navigasi yang sesuai dengan fitur Nakes dalam PRD:

1.  **Dashboard**
2.  **Pasien**
3.  **Keluhan Pasien**
4.  **Akun**

Subhalaman detail pasien dapat memiliki tab: - Ringkasan - Riwayat
Terapi - Resep Terapi - Jadwal Obat - Catatan - Keluhan

Jangan membuat item navigasi untuk fitur yang belum termasuk MVP. Item
aktif harus jelas melalui indikator visual dan label. Pada tablet atau
mobile, sidebar dapat menjadi drawer.

### 5.3 Halaman publik

Halaman sebelum login: - Login - Registrasi, jika registrasi Nakes
disediakan oleh alur autentikasi yang disepakati - 403 / akses ditolak
jika diperlukan - 404 / halaman tidak ditemukan

Jangan menampilkan data pasien pada halaman publik.

------------------------------------------------------------------------

## 6. Komponen UI Standar

### 6.1 Button

  -----------------------------------------------------------------------
  Varian                  Tampilan                Penggunaan
  ----------------------- ----------------------- -----------------------
  `primary`               Latar `primary`, teks   Aksi utama seperti
                          putih                   Simpan atau Buat Resep

  `secondary`             Latar putih/transparan, Aksi sekunder
                          border `primary`        

  `ghost`                 Tanpa latar, teks       Aksi ringan
                          `primary`               

  `danger`                Latar `danger`, teks    Tindakan destruktif
                          putih                   

  `disabled`              Tampilan nonaktif yang  Aksi tidak tersedia
                          tetap terbaca           
  -----------------------------------------------------------------------

Spesifikasi: - Tinggi standar 44px, idealnya 48px untuk kontrol utama. -
Radius `radius.md`. - Sediakan hover, focus-visible, active, loading,
dan disabled state. - Tombol ikon harus memiliki accessible name. -
Jangan membuat variasi tombol hanya demi dekorasi.

### 6.2 Input dan form

-   Tinggi input 44--48px.
-   Radius `radius.sm`.
-   Label selalu terlihat, jangan hanya mengandalkan placeholder.
-   Tampilkan helper text dan pesan error dekat field terkait.
-   Gunakan label serta satuan yang jelas untuk target sudut, repetisi,
    frekuensi, tanggal, dosis, dan waktu.
-   Form resep terapi dan jadwal obat hanya tersedia sebagai aksi Nakes.
-   Hindari mengarang field yang belum didukung PRD atau kontrak API.

### 6.3 Card

-   Background `surface`.
-   Radius `radius.lg`.
-   Padding 20px desktop dan 16px mobile.
-   Gunakan border tipis atau shadow ringan.
-   Kelompokkan informasi yang berhubungan; jangan menjadikan setiap
    data kecil sebagai card terpisah.

### 6.4 Badge status

Status yang dapat digunakan bila sesuai data: - Selesai - Terjadwal -
Berlangsung - Terlewat - Perlu ditinjau - Menunggu respons - Sudah
direspons

Badge tidak boleh mengarang status klinis atau kesimpulan medis. Selalu
tampilkan label teks.

### 6.5 Tabel

Tabel digunakan untuk daftar pasien, riwayat terapi, jadwal, dan
keluhan.

Aturan: - Header kolom harus jelas. - Gunakan tinggi baris yang nyaman
dan divider halus. - Tanggal, durasi, repetisi, dan status mudah
dipindai. - Posisi aksi per baris konsisten. - Jangan menyembunyikan
aksi penting hanya melalui hover. - Sediakan loading, empty, dan error
state. - Pada mobile, gunakan kartu per item atau scroll horizontal yang
jelas. - Pencarian dan filter ditempatkan dekat tabel.

### 6.6 Modal dan dialog

Gunakan untuk konfirmasi atau formulir singkat. Untuk alur panjang,
gunakan halaman khusus. Dialog harus memiliki judul jelas, tombol utama
dan batal, serta mendukung keyboard. Tindakan destruktif perlu
konfirmasi eksplisit.

### 6.7 Toast dan notifikasi

Gunakan untuk konfirmasi singkat. Error penting harus tetap terlihat di
halaman. Jangan menampilkan isi keluhan atau detail kesehatan sensitif
dalam toast.

### 6.8 Ikon

Gunakan satu pustaka ikon dengan gaya konsisten, misalnya Lucide. Ukuran
standar 20--24px, ikon utama maksimal sekitar 28--32px. Ikon tidak boleh
menggantikan label pada tindakan penting.

------------------------------------------------------------------------

## 7. Spesifikasi Halaman

### 7.1 Login Nakes

Field: - Email - Kata sandi

Elemen: - Judul dan penjelasan singkat. - Validasi yang jelas. - Tombol
masuk dengan loading state. - Pesan gagal login yang tidak membocorkan
apakah suatu email terdaftar.

Website ini ditujukan kepada Nakes. Jangan membuat pilihan atau alur
masuk pasien pada website.

### 7.2 Registrasi Nakes

Buat hanya jika registrasi mandiri termasuk dalam alur autentikasi yang
benar-benar disediakan. Gunakan field sesuai kontrak API; jangan
mengarang data profil atau proses verifikasi yang belum ditetapkan.

Pilihan role di frontend bukan bukti kewenangan Nakes. Backend harus
memvalidasi role dan hak akses.

### 7.3 Dashboard Monitoring

Tujuan: membantu Nakes memahami aktivitas pasien yang menjadi tanggung
jawabnya.

Urutan konten: 1. Judul dashboard. 2. Ringkasan jumlah pasien yang
ditangani. 3. Ringkasan kepatuhan terapi. 4. Ringkasan kepatuhan obat.
5. Sesi terapi terbaru. 6. Tren hasil terapi jika data historis memadai.
7. Keluhan yang belum ditangani.

Aturan: - Semua angka berasal dari data backend. - Jangan menampilkan
angka dummy seolah-olah data nyata. - Grafik harus memiliki judul,
rentang waktu, label, dan konteks. - Jika data tidak cukup untuk tren,
tampilkan empty state. - Jangan membuat diagnosis atau kesimpulan
kondisi pasien berdasarkan metrik ringkasan.

### 7.4 Daftar Pasien

Tampilkan pasien yang berada di bawah tanggung jawab Nakes.

Kolom yang dapat digunakan sesuai data tersedia: - Nama pasien. -
Identitas relevan. - Aktivitas/sesi terapi terbaru. - Ringkasan
kepatuhan terapi. - Ringkasan kepatuhan obat. - Status keluhan yang
menunggu respons. - Aksi melihat detail.

Pencarian dan filter dapat disediakan bila berguna untuk jumlah data.
Jangan menampilkan informasi sensitif yang tidak dibutuhkan untuk
monitoring.

Backend wajib memastikan Nakes hanya dapat mengakses pasien yang menjadi
tanggung jawabnya.

### 7.5 Detail Pasien

Halaman ini merupakan pusat kerja Nakes untuk satu pasien.

Header: - Nama dan informasi identitas yang relevan. - Ringkasan program
terapi jika tersedia. - Aksi yang sesuai hak akses.

Tab atau section: 1. **Ringkasan:** aktivitas dan kepatuhan yang
tersedia. 2. **Riwayat Terapi:** waktu sesi, estimasi sudut, repetisi
valid, dan durasi. 3. **Resep Terapi:** daftar resep serta formulir
membuat/mengubah resep. 4. **Jadwal Obat:** daftar jadwal serta formulir
membuat/mengubah jadwal. 5. **Catatan:** catatan terdahulu dan formulir
catatan baru. 6. **Keluhan:** ringkasan AI dan respons Nakes.

Jangan menampilkan data yang tidak tersedia. Saat berpindah dari satu
pasien ke pasien lain, pastikan data pasien sebelumnya tidak tertinggal
selama loading.

### 7.6 Resep Terapi

Field sesuai PRD: - Jenis gerakan. - Target sudut jika ditentukan. -
Target repetisi. - Frekuensi terapi. - Tanggal mulai. - Tanggal
berakhir.

Aturan: - Gunakan label dan satuan yang jelas. - Validasi tanggal dan
input dengan pesan yang mudah dipahami. - Bedakan tindakan membuat resep
dengan mengubah resep. - Tampilkan konfirmasi setelah penyimpanan
berhasil. - Jangan menambahkan rekomendasi klinis otomatis. - Pasien
hanya menjalankan instruksi melalui aplikasi mobile; website tidak
menyediakan alur pelaksanaan terapi untuk pasien.

### 7.7 Jadwal Obat

Field: - Nama obat. - Dosis. - Waktu konsumsi. - Jadwal penggunaan.

Aturan: - Jadwal dibuat atau diubah oleh Nakes. - Jangan memberikan
saran dosis otomatis. - Tampilkan validasi dan hasil penyimpanan dengan
jelas. - Hindari penghapusan atau perubahan yang tidak disengaja.

### 7.8 Riwayat Terapi

Tampilkan sesi yang direkam aplikasi mobile: - Pasien terkait. - Program
atau gerakan. - Estimasi sudut. - Repetisi valid. - Durasi sesi. - Waktu
pelaksanaan.

Hasil gyroscope merupakan estimasi pergerakan, bukan pengukuran medis
resmi. Hindari menyebut angka sebagai hasil pengukuran medis yang
presisi. Gunakan filter waktu jika bermanfaat dan didukung data.

### 7.9 Catatan Pasien

Nakes dapat membuat catatan untuk pasien.

Tampilan: - Daftar catatan dalam urutan waktu yang konsisten. - Isi
catatan. - Identitas Nakes pembuat. - Waktu dibuat.

Catatan akan dibaca pasien melalui aplikasi mobile. Website hanya
menyediakan fungsi Nakes untuk membuat dan melihat catatan sesuai izin
yang tersedia.

### 7.10 Keluhan Pasien dan Ringkasan AI

Tampilkan: - Nama atau identitas pasien yang relevan. - Waktu keluhan
dikirim. - Ringkasan keluhan yang dibuat AI. - Status penanganan. -
Respons Nakes jika ada. - Formulir memberikan respons.

Pisahkan ringkasan AI dan respons Nakes secara visual. AI berfungsi
sebagai perantara informasi dan tidak boleh diperlakukan sebagai sumber
diagnosis atau keputusan klinis. Ringkasan hanya dapat diakses oleh
Nakes yang berwenang terhadap pasien terkait.

### 7.11 Akun dan Logout

Sediakan tampilan informasi akun yang memang tersedia dari backend dan
aksi logout. Jangan membangun fitur edit profil lengkap jika belum
termasuk scope yang disepakati.

------------------------------------------------------------------------

## 8. State Halaman dan Interaksi

Setiap halaman berbasis API minimal memiliki state yang relevan:

1.  **Loading:** data sedang dimuat.
2.  **Success:** data berhasil dimuat atau disimpan.
3.  **Empty:** belum ada data.
4.  **Error:** request gagal, dengan opsi mencoba kembali bila masuk
    akal.
5.  **Unauthorized:** sesi tidak valid atau berakhir.
6.  **Forbidden:** pengguna tidak memiliki akses.
7.  **Partial data:** sebagian data tidak tersedia; jangan mengarang
    nilai yang hilang.

Setiap aksi mutasi harus mencegah pengiriman berulang yang tidak
disengaja, menampilkan status proses, dan memberikan umpan balik hasil.

Contoh empty state: - "Belum ada pasien yang ditampilkan." - "Belum ada
sesi terapi yang tercatat." - "Tidak ada keluhan yang menunggu
respons." - "Belum ada jadwal obat untuk pasien ini."

Jangan menggunakan empty state untuk menyamarkan error API.

------------------------------------------------------------------------

## 9. Aksesibilitas

-   Pastikan kontras teks dan latar memadai.
-   Semua fungsi utama dapat dioperasikan dengan keyboard.
-   Gunakan indikator `focus-visible`.
-   Label form harus terhubung dengan input.
-   Status tidak boleh hanya dibedakan dengan warna.
-   Jangan menghilangkan outline fokus tanpa pengganti.
-   Target kontrol interaktif minimal sekitar 44 × 44px.
-   Tabel harus memiliki struktur header yang benar.
-   Modal harus mengelola fokus keyboard dengan benar.
-   Grafik harus memiliki judul, label, dan ringkasan tekstual.
-   Hormati pengaturan reduced motion.
-   Gunakan bahasa Indonesia yang jelas dan konsisten.

------------------------------------------------------------------------

## 10. Responsif

-   Desktop menjadi prioritas utama untuk monitoring dan pengelolaan
    pasien.
-   Pada tablet, sidebar dapat berubah menjadi drawer.
-   Pada mobile browser, navigasi dan tabel harus tetap dapat digunakan.
-   Jangan mengandalkan hover untuk aksi penting.
-   Formulir harus dapat digunakan tanpa scroll horizontal.
-   Tabel kompleks dapat berubah menjadi kartu atau menggunakan scroll
    horizontal yang jelas.
-   Grafik harus tetap memiliki label yang dapat dibaca pada layar
    kecil.

------------------------------------------------------------------------

## 11. Privasi dan Keamanan UI

-   Website hanya untuk Nakes yang sudah terautentikasi dan memiliki hak
    akses.
-   Jangan menampilkan data pasien di halaman publik.
-   Jangan menaruh data kesehatan sensitif di URL, log frontend,
    analytics, atau pesan error.
-   Jangan menggunakan data pasien nyata pada screenshot demo atau seed
    data publik.
-   Backend tetap wajib melakukan authentication, RBAC, dan ownership
    check pada setiap request.
-   Jangan menampilkan stack trace, token, secret, kredensial database,
    atau detail internal server.
-   Jangan menggambarkan estimasi gyroscope sebagai pengukuran medis.
-   Jangan menggambarkan AI sebagai pengganti tenaga kesehatan.
-   Jangan membuat fitur atau tampilan untuk akses pasien melalui
    website.

------------------------------------------------------------------------

## 12. Tech Stack Frontend

Website Connect untuk Nakes menggunakan **Vue 3 dengan JavaScript biasa
(vanilla Vue)** sebagai framework frontend. Gunakan **Vite** sebagai
development server dan build tool jika project belum memiliki
konfigurasi lain. Implementasi ini tidak menggunakan Nuxt, React,
TypeScript, atau UI framework besar kecuali diputuskan secara terpisah.

Pedoman implementasi: - Gunakan Vue 3 Composition API dengan
`<script setup>` untuk komponen baru. - Gunakan Single-File Components
(`.vue`) untuk komponen dan halaman. - Gunakan CSS biasa dan CSS
variables untuk design tokens. Jangan mengasumsikan Tailwind CSS atau
library komponen sudah terpasang. - Gunakan Vue Router hanya jika
routing belum tersedia dan website membutuhkan navigasi ant halaman. -
Pisahkan pemanggilan API dari komponen tampilan, misalnya melalui modul
`services/`. - Simpan token autentikasi secara aman sesuai mekanisme
backend. Jangan menaruh secret di frontend. - Buat komponen reusable
untuk pola yang berulang, tetapi hindari abstraksi berlebihan. - Ikuti
struktur folder project yang sudah ada. Struktur di bawah merupakan
rekomendasi, bukan instruksi untuk merombak project tanpa alasan.

## 13. Aturan Implementasi Design System

Semua token visual harus dikelola secara terpusat. Struktur berikut
adalah rekomendasi konseptual, bukan asumsi bahwa direktori ini sudah
ada:

``` text
src/
├── assets/
├── styles/
│   ├── tokens.css
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button
│   │   ├── Input
│   │   ├── Card
│   │   ├── Badge
│   │   ├── Modal
│   │   ├── Table
│   │   ├── EmptyState
│   │   ├── LoadingState
│   │   └── ErrorState
│   └── layout/
│       ├── NakesLayout
│       ├── Sidebar
│       ├── Topbar
│       └── PageHeader
├── services/
│   └── api.js
├── features/
│   ├── auth/
│   ├── patients/
│   ├── therapy/
│   ├── medication/
│   ├── notes/
│   └── complaints/
├── router/
│   └── index.js
├── App.vue
└── main.js
```

Jika project belum membutuhkan Vue Router, folder `router/` boleh tidak
dibuat.

Aturan wajib: 1. Jangan mengulang hex warna langsung di file halaman. 2.
Gunakan kembali komponen yang sama untuk pola UI yang sama. 3. Semua
spacing dan radius menggunakan token. 4. Komponen interaktif harus
memiliki state yang sesuai. 5. Pisahkan presentasi dari pemanggilan API
sesuai arsitektur frontend. 6. Jangan mengandalkan frontend untuk
otorisasi data. 7. Jangan menambahkan fitur di luar MVP hanya untuk
memperindah dashboard. 8. Jangan mengganti palet atau font tanpa
memperbarui dokumen ini. 9. Jangan membuat data mock terlihat seperti
data produksi. 10. Jangan menambahkan halaman atau navigasi pasien.

### Contoh token CSS

``` css
:root {
  --color-primary-dark: #074173;
  --color-primary: #1679AB;
  --color-accent-teal: #5DEBD7;
  --color-accent-lime: #C5FF95;

  --color-bg-base: #F7FAFC;
  --color-surface: #FFFFFF;
  --color-text-primary: #0B2436;
  --color-text-secondary: #5C7A91;
  --color-border: #DCE8F0;
  --color-disabled: #B8C5CE;

  --color-success: #2FAE60;
  --color-danger: #D64545;
  --color-warning: #E3A008;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 999px;

  --font-family: "Poppins", sans-serif;
}
```

Skala tipografi, container, dan breakpoint juga harus dikelola secara
terpusat dalam sistem styling yang dipilih.

------------------------------------------------------------------------

## 13. Fitur di Luar Scope Website MVP

Sesuai PRD, jangan menambahkan UI untuk: - Aplikasi atau dashboard
pasien. - Menjalankan sesi terapi sebagai pasien melalui website. -
Mencatat konsumsi obat sebagai pasien melalui website. - Chatbot pasien
melalui website. - Integrasi SATUSEHAT. - Integrasi langsung dengan
sistem rumah sakit/puskesmas. - Modul skrining penyakit lain. - Akun
caregiver/keluarga. - Diagnosis atau resep otomatis berbasis AI. - Push
notification real-time. - Integrasi wearable device. - Integrasi
goniometer medis. - Video call dengan Nakes. - Pembayaran atau billing.

Pasien menjalankan alur terapi, jadwal obat, dan percakapan keluhan
melalui aplikasi mobile yang terpisah.

------------------------------------------------------------------------

## 14. Checklist Sebelum Menambah atau Mengubah Halaman

-   [ ] Halaman ditujukan untuk Nakes dan sesuai dengan PRD.
-   [ ] Tidak ada alur login atau dashboard pasien di website.
-   [ ] Warna menggunakan token yang ditentukan.
-   [ ] Tipografi menggunakan Poppins dan skala yang ditentukan.
-   [ ] Spacing mengikuti kelipatan 4px.
-   [ ] Radius dan gaya card konsisten.
-   [ ] Ada loading, empty, error, dan success state jika relevan.
-   [ ] Layout diuji di desktop, tablet, dan mobile.
-   [ ] Interaksi dapat digunakan dengan keyboard.
-   [ ] Status tidak hanya dibedakan melalui warna.
-   [ ] Data pasien tidak bocor antarhalaman atau antar-Nakes.
-   [ ] Hasil gyroscope disebut sebagai estimasi.
-   [ ] AI diposisikan sebagai perantara informasi, bukan pengganti
    Nakes.
-   [ ] Tidak ada fitur di luar MVP tanpa persetujuan.
-   [ ] Komponen yang sudah ada digunakan ulang bila sesuai.

------------------------------------------------------------------------

## 15. Prinsip Akhir

Dokumen ini menjadi acuan desain website Connect khusus Nakes. Jika
kebutuhan implementasi tidak tercakup di sini, tambahkan aturan yang
disepakati sebelum memperkenalkan pola visual baru.

**Tujuan desainnya adalah membantu Nakes memantau pasien, meninjau
informasi terapi, mengelola instruksi, dan menindaklanjuti keluhan
secara jelas, efisien, konsisten, dan aman.**
