// Hotspots on the hero image. x / y are fractions (0–1) of the image size.
export const hotspots = [
  { title: 'Layanan program', text: 'Program fisioterapi terstruktur. Dokter menetapkan target gerak, pasien menjalankan sesi, dan hasilnya tercatat otomatis.', x: 0.24, y: 0.38, side: 'right' },
  { title: 'Manfaat', text: 'Dokter melihat perkembangan pasien tanpa menunggu kontrol berikutnya, sehingga terapi bisa disesuaikan lebih cepat.', x: 0.5, y: 0.58, side: 'right' },
  { title: 'Langkah ke depan', text: 'Aplikasi mobile untuk pasien: sinkron dengan kalender dan membaca data gyroscope dari perangkat sendiri.', x: 0.76, y: 0.4, side: 'left' },
]

export const tech = [
  { title: 'Sensor gyroscope', text: 'Mengukur sudut, kecepatan, dan keseimbangan gerakan pasien selama latihan.' },
  { title: 'Dashboard dokter', text: 'Grafik perkembangan tiap pasien dan riwayat sesi terkumpul di satu layar.' },
  { title: 'Asisten AI', text: 'Menanyakan keluhan awal pasien, lalu merangkumnya untuk dokter sebelum sesi.' },
]

export const services = [
  { title: 'Program fisioterapi terjadwal', text: 'Rangkaian latihan disusun dokter sesuai kondisi pasien.' },
  { title: 'Pemantauan gerak', text: 'Data gyroscope direkam tiap sesi dan langsung masuk ke dashboard.' },
  { title: 'Catatan keluhan harian', text: 'Pasien melaporkan nyeri dan kendala, dokter melihatnya berurutan.' },
  { title: 'Pengingat obat dan latihan', text: 'Jadwal otomatis, dengan umpan balik kepatuhan ke dokter.' },
  { title: 'Konsultasi awal dengan AI', text: 'Ringkasan gejala siap dibaca sebelum pasien bertemu dokter.' },
  { title: 'Laporan perkembangan', text: 'Ringkasan berkala untuk pasien dan keluarga.' },
]

export const benefits = [
  { title: 'Tindakan lebih cepat', text: 'Gerakan yang menyimpang terlihat saat itu juga, bukan di kontrol berikutnya.' },
  { title: 'Riwayat tertata', text: 'Semua sesi, keluhan, dan hasil ukur tersimpan rapi per pasien.' },
  { title: 'Keputusan berbasis data', text: 'Analitik real-time membantu dokter menyesuaikan intensitas terapi.' },
]

// Items with `lines` render several paragraphs under one heading.
export const roadmap = [
  {
    title: 'Pengembangan',
    lines: [
      'Aplikasi mobile untuk pasien.',
      'Sinkronisasi otomatis dengan kalender pasien.',
      'Pembacaan gyroscope langsung dari ponsel pasien.',
    ],
  },
  {
    title: 'Benefit jangka panjang',
    lines: [
      'Pemulihan pasien lebih terarah dan terukur.',
      'Berkurangnya kunjungan yang tidak perlu.',
      'Data historis untuk menilai efektivitas program.',
    ],
  },
]