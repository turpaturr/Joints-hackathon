const makeSamples = (phase = 0) =>
  Array.from({ length: 13 }, (_, index) => {
    const time = index * 10
    const progress = index / 12
    const cycle = Math.sin(progress * Math.PI * 4 + phase)

    return {
      time,
      x: Math.round(cycle * 34 + Math.sin(progress * Math.PI * 8) * 5),
      y: Math.round(Math.sin(progress * Math.PI * 4 + phase + 1.1) * 19),
      z: Math.round(Math.cos(progress * Math.PI * 4 + phase + 0.5) * 13),
    }
  })

export const demoPatient = {
  id: 'demo-patient',
  namaLengkap: 'Nadia Putri Maharani',
  tanggalLahir: '1992-04-18T00:00:00.000Z',
  jenisKelamin: 'PEREMPUAN',
  nomorTelepon: '+62 812-3456-7890',
  alamat: 'Bandung, Jawa Barat',
  kondisiMedis: 'Pemulihan cedera lutut kanan',
  catatanAwal: 'Pasien sedang menjalani rehabilitasi pasca cedera. Fokus pada peningkatan rentang gerak dan kekuatan secara bertahap.',
  user: { email: 'nadia.maharani@example.com' },
}

export const demoSessions = [
  {
    id: 'session-today',
    programName: 'Fleksi dan ekstensi lutut',
    performedAt: '2026-10-12T09:42:00.000Z',
    durationMs: 130000,
    validRepetitions: 18,
    estimatedAngle: 84,
    sampleCount: 13,
    samples: makeSamples(),
    videoUrl: null,
    note: 'Gerakan stabil. Rentang gerak membaik dibandingkan sesi sebelumnya.',
    accuracy: 92,
  },
  {
    id: 'session-yesterday',
    programName: 'Ekstensi lutut',
    performedAt: '2026-10-11T16:18:00.000Z',
    durationMs: 110000,
    validRepetitions: 15,
    estimatedAngle: 78,
    sampleCount: 12,
    samples: makeSamples(0.7).slice(0, 12),
    videoUrl: null,
    note: 'Kontrol gerakan membaik. Pertahankan tempo yang konsisten.',
    accuracy: 86,
  },
  {
    id: 'session-week',
    programName: 'Fleksi lutut',
    performedAt: '2026-10-10T10:05:00.000Z',
    durationMs: 145000,
    validRepetitions: 16,
    estimatedAngle: 81,
    sampleCount: 13,
    samples: makeSamples(1.2),
    videoUrl: null,
    note: 'Sesi selesai sesuai target repetisi.',
    accuracy: 89,
  },
]

export const demoTasks = [
  { name: 'Fleksi lutut', detail: '3 set · 10 repetisi', frequency: '2× sehari', complete: true },
  { name: 'Ekstensi lutut', detail: '3 set · 8 repetisi', frequency: '2× sehari', complete: false },
  { name: 'Peregangan hamstring', detail: 'Tahan 20 detik · 5 repetisi', frequency: '1× sehari', complete: false },
]

export const demoMovements = [
  {
    name: 'Fleksi lutut',
    category: 'Rentang gerak',
    instruction: 'Duduk di kursi, tekuk lutut perlahan ke belakang sejauh nyaman. Tahan 3 detik, lalu kembali.',
    target: '3 set × 10 repetisi',
    progress: 72,
  },
  {
    name: 'Ekstensi lutut',
    category: 'Penguatan',
    instruction: 'Luruskan lutut hingga kaki sejajar lantai. Jaga paha tetap rileks dan turunkan perlahan.',
    target: '3 set × 8 repetisi',
    progress: 48,
  },
]
