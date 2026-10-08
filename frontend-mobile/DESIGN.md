# Design System — Connect (Mobile)

Dokumen ini adalah aturan desain tetap untuk aplikasi mobile Connect (React Native). Tujuannya satu: supaya tampilan aplikasi konsisten dari layar ke layar, siapa pun yang mengerjakan (termasuk kalau dibantu AI coding agent). **Jangan menyimpang dari token di dokumen ini tanpa memperbarui dokumen ini juga.**

---

## 1. Prinsip Desain

Connect adalah aplikasi kesehatan yang menemani pasien melakukan terapi mandiri di rumah. Kesan yang ingin dibangun:

- **Dipercaya (biru)** — karena ini aplikasi kesehatan, nuansa biru tua/biru medis memberi kesan klinis dan dapat diandalkan
- **Memberi harapan & progres (hijau)** — hijau/toska melambangkan pemulihan, kemajuan, hal positif. Dipakai untuk menandai keberhasilan, progres, dan ajakan bertindak yang terasa "menyemangati", bukan menekan
- **Tenang, tidak ramai** — pasien yang membuka aplikasi ini kemungkinan sedang dalam kondisi pemulihan. Hindari elemen visual yang riuh, kontras berlebihan, atau animasi berlebihan
- **Jelas dan besar** — banyak pengguna berusia lebih tua atau dalam kondisi fisik terbatas. Target sentuh besar, teks terbaca jelas, hierarki visual tegas

---

## 2. Tipografi

**Font:** Poppins (seluruh aplikasi, tidak ada font kedua)

### Setup
```bash
npx expo install @expo-google-fonts/poppins expo-font expo-splash-screen
```

Load minimal 4 weight berikut, jangan tambah weight lain supaya bundle size tidak membengkak:
- `Poppins_400Regular`
- `Poppins_500Medium`
- `Poppins_600SemiBold`
- `Poppins_700Bold`

### Skala Tipografi

| Token | Size | Line Height | Weight | Dipakai untuk |
|---|---|---|---|---|
| `display` | 28px | 36px | SemiBold | Judul halaman utama (contoh: "Halo, Budi") |
| `h1` | 22px | 30px | SemiBold | Judul section besar |
| `h2` | 18px | 26px | SemiBold | Judul card, judul sub-section |
| `body` | 15px | 22px | Regular | Teks paragraf, deskripsi |
| `bodyMedium` | 15px | 22px | Medium | Teks penting dalam body (label aktif, dsb) |
| `button` | 16px | 20px | SemiBold | Teks di dalam tombol |
| `caption` | 13px | 18px | Regular | Keterangan kecil, timestamp, helper text |
| `label` | 12px | 16px | Medium | Label form, tag kecil |

**Aturan:**
- Jangan pakai ukuran di luar tabel ini. Kalau butuh ukuran baru, tambahkan ke tabel dulu, baru pakai di kode
- Jangan pakai ALL CAPS untuk label — cukup Medium weight + warna sekunder untuk membedakan
- Satu layar maksimal memakai 3 tingkat ukuran teks. Jangan campur banyak ukuran dalam satu card

---

## 3. Warna

### Palet Inti

| Token | Hex | Nama Role |
|---|---|---|
| `primaryDark` | `#074173` | **Primary Dark** — header, teks penting di atas background terang, status bar |
| `primary` | `#1679AB` | **Primary** — warna aksi utama, tombol utama, ikon aktif, link |
| `accentTeal` | `#5DEBD7` | **Accent (Progres/Positif)** — indikator progres, highlight ringan, elemen "hidup/bergerak" |
| `accentLime` | `#C5FF95` | **Accent Light (Sukses/Pencapaian)** — badge pencapaian, status "selesai", elemen kecil penyemangat |

### Warna Netral (wajib ditambahkan, dipakai untuk teks & background)

| Token | Hex | Dipakai untuk |
|---|---|---|
| `bgBase` | `#F7FAFC` | Background utama seluruh layar (bukan putih polos, sedikit kebiruan supaya menyatu dengan tema) |
| `surface` | `#FFFFFF` | Background card/komponen di atas `bgBase` |
| `textPrimary` | `#0B2436` | Teks utama (bukan hitam pekat, diturunkan dari `primaryDark` supaya tetap dalam nuansa biru) |
| `textSecondary` | `#5C7A91` | Teks sekunder/deskripsi, diturunkan dari `primary` |
| `border` | `#DCE8F0` | Garis pembatas, outline input, pembatas card |
| `disabled` | `#B8C5CE` | Teks/komponen nonaktif (contoh: tab Profil yang belum dikembangkan) |

### Warna Semantik (fungsional, dipakai seperlunya saja)

| Token | Hex | Dipakai untuk |
|---|---|---|
| `success` | `#2FAE60` | Konfirmasi berhasil (gunakan ini, bukan `accentLime`, untuk pesan sukses supaya tetap kontras cukup untuk teks) |
| `danger` | `#D64545` | Error, peringatan darurat, tombol hapus |
| `warning` | `#E3A008` | Peringatan non-darurat (contoh: pengingat terlewat) |

### Aturan Pemakaian Warna

- **Dominasi visual: 60% netral (bgBase/surface), 30% biru (primary/primaryDark), 10% hijau (accentTeal/accentLime)** — hijau dipakai sebagai aksen penyemangat, bukan warna dasar
- `accentLime` (`#C5FF95`) kontrasnya rendah untuk teks di atasnya — **jangan pernah dipakai sebagai background tombol dengan teks putih**. Pakai sebagai background badge kecil dengan teks `primaryDark` di atasnya, atau sebagai elemen dekoratif (progress bar, ikon)
- `primaryDark` (`#074173`) dipakai untuk teks/ikon di atas background terang, **bukan** untuk background tombol besar (terlalu gelap, berat secara visual). Untuk tombol utama pakai `primary` (`#1679AB`)
- Jangan memperkenalkan warna baru di luar tabel ini tanpa menambahkannya ke dokumen dulu

---

## 4. Spacing

Base unit: **4px**. Semua padding/margin harus kelipatan angka ini, jangan pakai angka bebas seperti `13px` atau `21px`.

| Token | Value | Dipakai untuk |
|---|---|---|
| `space.xs` | 4px | Jarak antar elemen sangat rapat (icon ke teks) |
| `space.sm` | 8px | Jarak antar elemen dalam satu komponen kecil |
| `space.md` | 16px | Padding dalam card, jarak antar elemen form |
| `space.lg` | 24px | Jarak antar section dalam satu layar |
| `space.xl` | 32px | Jarak besar (atas judul halaman, dsb) |
| `space.xxl` | 48px | Jarak sangat besar (jarang dipakai, misal spacer sebelum footer) |

**Aturan layout:**
- Padding horizontal layar (screen padding): **20px** di kiri-kanan, konsisten di semua halaman
- Jarak antar card dalam list/grid: **12px**
- Jangan menempelkan teks langsung ke tepi card — minimal `space.md` (16px) padding dalam card

---

## 5. Border Radius

| Token | Value | Dipakai untuk |
|---|---|---|
| `radius.sm` | 8px | Input field, badge kecil |
| `radius.md` | 12px | Tombol, card kecil |
| `radius.lg` | 16px | Card utama/feature card |
| `radius.full` | 999px | Tombol pill, avatar bulat, badge status |

Jangan campur radius berbeda dalam satu grup komponen yang sejenis (misal semua feature card harus `radius.lg`, tidak ada yang `radius.md`).

---

## 6. Elevation / Shadow

Pakai shadow tipis saja, jangan berat. Satu standar untuk semua card:

```js
shadow: {
  shadowColor: '#074173',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2, // Android
}
```

Tidak ada "level shadow" bertingkat (small/medium/large). Satu saja, dipakai konsisten di semua card dan tombol yang terangkat.

---

## 7. Komponen

### 7.1 Tombol (Button)

| Varian | Background | Teks | Border | Dipakai untuk |
|---|---|---|---|---|
| **Primary** | `primary` (#1679AB) | putih, `button` style | tidak ada | Aksi utama layar (contoh: "Mulai Terapi") |
| **Secondary (Outline)** | transparan | `primary` | 1.5px `primary` | Aksi sekunder (contoh: "Lihat Detail") |
| **Ghost/Text** | transparan | `primary` | tidak ada | Aksi tersier (contoh: "Lewati") |
| **Disabled** | `disabled` (#B8C5CE) | putih | tidak ada | Tombol belum bisa ditekan |
| **Danger** | `danger` (#D64545) | putih | tidak ada | Aksi berisiko (contoh: "Hapus Jadwal") |

**Spesifikasi ukuran (berlaku untuk semua varian):**
- Height: **52px** (ukuran standar, touch target besar karena target pengguna termasuk lansia/kondisi fisik terbatas)
- Border radius: `radius.md` (12px)
- Padding horizontal: `space.lg` (24px)
- Lebar: default full-width di dalam container dengan screen padding, kecuali tombol kecil dalam card (ikuti lebar konten)
- State pressed: turunkan opacity ke 0.85, jangan ganti warna drastis
- Jarak minimal antar dua tombol bersebelahan: `space.sm` (8px)

### 7.2 Card

- Background: `surface` (#FFFFFF)
- Border radius: `radius.lg` (16px)
- Padding dalam: `space.md` (16px)
- Shadow: standar di bagian 6
- Border: opsional, kalau dipakai gunakan 1px `border` (#DCE8F0) — jangan pakai shadow DAN border tebal sekaligus, pilih salah satu penekanan

### 7.3 Input Field

- Height: 48px
- Border radius: `radius.sm` (8px)
- Border: 1px `border`, berubah jadi 1.5px `primary` saat fokus
- Padding horizontal: `space.md` (16px)
- Teks: `body` style, warna `textPrimary`
- Placeholder: warna `textSecondary`

### 7.4 Bottom Navigation

- Background: `surface`
- Ikon aktif: `primary`, ikon nonaktif: `textSecondary`
- Label di bawah ikon: `caption` style
- Tinggi bar: 64px + safe area bottom
- Indikator tab aktif: titik kecil atau underline tipis warna `primary` di atas ikon (bukan background berubah penuh, supaya tetap tenang)

### 7.5 Badge / Status Tag

- Border radius: `radius.full`
- Padding: 4px vertikal, 10px horizontal
- Contoh penggunaan warna:
  - Status "Selesai" → background `accentLime`, teks `primaryDark`
  - Status "Berlangsung" → background `accentTeal` (opacity 20%), teks `primaryDark`
  - Status "Terlewat" → background `danger` (opacity 15%), teks `danger`

### 7.6 Ikon

- Ukuran default: 24px
- Ukuran ikon fitur di home (dalam card besar): 32px
- Satu set ikon saja untuk seluruh aplikasi (disarankan: `lucide-react-native` atau `@expo/vector-icons` — Ionicons), jangan campur beberapa icon pack berbeda gaya

---

## 8. Tata Letak Halaman

### 8.1 Home (Pasien)

**Struktur dari atas ke bawah:**

```
┌─────────────────────────────────┐
│  [Status Bar]                    │
│                                   │
│  Halo, {Nama Pasien}   (display) │ ← space.xl dari atas
│  Semangat terapi hari ini         (body, textSecondary)
│                                   │
│  ┌─────────────────────────────┐ │
│  │  🏃  Lakukan Terapi          │ │ ← Feature card, full width
│  │  Mulai sesi terapi hari ini  │ │    radius.lg, shadow standar
│  └─────────────────────────────┘ │
│                                   │ ← space.md (12px) antar card
│  ┌─────────────────────────────┐ │
│  │  📋  Riwayat Terapi           │ │
│  │  Lihat progres terapimu      │ │
│  └─────────────────────────────┘ │
│                                   │
│  ┌─────────────────────────────┐ │
│  │  💬  Cek Keluhan dengan Dokter│ │
│  │  Ngobrol dulu sebelum konsultasi│
│  └─────────────────────────────┘ │
│                                   │
│                                   │
├─────────────────────────────────┤
│   [Home]          [Profil]       │ ← Bottom Navigation
└─────────────────────────────────┘
```

**Detail komponen "Feature Card" di Home:**
- Full width (mengikuti screen padding 20px kiri-kanan)
- Isi: ikon (32px, warna `primary`) di kiri, judul (`h2`) + deskripsi singkat (`caption`, `textSecondary`) di kanannya, chevron kecil (›) di ujung kanan menandakan bisa ditekan
- Seluruh card bisa ditekan (bukan cuma teksnya), beri efek pressed opacity 0.9
- **Urutan card tetap**: Lakukan Terapi → Riwayat Terapi → Cek Keluhan dengan Dokter. Jangan diacak atau diubah urutannya tanpa alasan, karena ini juga urutan prioritas alur pasien (terapi dulu, baru lihat riwayat, baru konsultasi kalau ada masalah)

**Catatan:** Untuk saat ini hanya 3 fitur ini yang dikembangkan penuh. Jangan menambahkan card fitur lain di Home kecuali diminta — ini untuk mencegah scope creep di tahap development sekarang.

### 8.2 Profil

Untuk tahap ini, halaman Profil **cukup dibuat minimal/placeholder**: foto, nama, email, tombol logout. Jangan membangun fitur edit profil lengkap dulu sampai diminta eksplisit.

---

## 9. Struktur File Styling (React Native)

Supaya token di atas benar-benar dipakai konsisten di kode, bukan angka hardcode berulang:

```
src/
├── theme/
│   ├── colors.ts       # Semua token warna di bagian 3
│   ├── typography.ts   # Semua token tipografi di bagian 2
│   ├── spacing.ts       # Semua token spacing di bagian 4
│   ├── radius.ts         # Token border radius di bagian 5
│   └── index.ts          # Export gabungan (theme object)
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── FeatureCard.tsx
│   ├── Badge.tsx
│   └── Input.tsx
└── screens/
    ├── Home/
    └── Profile/
```

**Aturan wajib:**
- **Tidak boleh ada hex code atau angka px hardcode langsung di file screen/komponen.** Semua warna, spacing, radius, dan ukuran font HARUS diimpor dari `src/theme/`. Contoh yang benar: `color: theme.colors.primary`, bukan `color: '#1679AB'`
- Kalau butuh warna/ukuran baru yang belum ada di token, **tambahkan dulu ke file theme**, baru pakai di komponen — jangan sebaliknya
- Satu komponen reusable (`Button`, `Card`, dst) dipakai ulang di semua layar, jangan bikin versi custom berulang-ulang per layar

---

## 10. Aksesibilitas

- Kontras teks `textPrimary` di atas `bgBase`/`surface` sudah memenuhi standar AA — pertahankan ini, jangan menurunkan opacity teks utama di bawah 0.9
- Semua target sentuh (tombol, card, tab) minimal 44x44px, idealnya 48x48px
- Jangan menyampaikan informasi hanya lewat warna saja (contoh: status terapi) — selalu sertakan label teks/ikon, bukan cuma warna badge, supaya tetap jelas untuk pengguna dengan gangguan penglihatan warna

---

## 11. Checklist Sebelum Menambah Layar Baru

Sebelum membuat layar baru (baik oleh manusia maupun AI coding agent), pastikan:

- [ ] Semua teks pakai token dari bagian 2, bukan ukuran bebas
- [ ] Semua warna pakai token dari bagian 3, bukan hex langsung
- [ ] Semua spacing kelipatan 4px dan pakai token dari bagian 4
- [ ] Tombol mengikuti salah satu varian di bagian 7.1, tidak membuat varian baru tanpa alasan
- [ ] Card mengikuti spesifikasi bagian 7.2
- [ ] Tidak menambah font selain Poppins
- [ ] Tidak menambah warna selain yang ada di bagian 3

---

*Dokumen ini adalah acuan tetap. Kalau ada kebutuhan yang tidak tercakup di sini saat development, berhenti dulu dan tambahkan aturannya ke dokumen ini sebelum lanjut coding, supaya tidak ada keputusan desain yang dibuat sembarangan di tengah jalan.*