<script setup>
defineProps({
  patients: { type: Array, required: true },
})

const emit = defineEmits(['select'])

function formatGender(value) {
  const normalized = value?.trim().toUpperCase()
  if (normalized === 'LAKI_LAKI') return 'Pria'
  if (normalized === 'PEREMPUAN') return 'Wanita'
  return value || 'Tidak tersedia'
}
</script>

<template>
  <section class="min-w-0 rounded-card border border-line bg-surface p-4 shadow-[var(--connect-shadow-card)] sm:p-5" aria-label="Daftar pasien">
    <header class="mb-3 flex items-center justify-between gap-3">
      <div>
        <p class="mb-1 text-xs font-medium text-primary">Data pasien</p>
        <h2 class="text-lg font-semibold text-primary-dark">Daftar pasien</h2>
      </div>
      <span class="text-sm text-muted">{{ patients.length }} pasien</span>
    </header>
    <div class="overflow-x-auto">
      <table class="w-full min-w-[1440px] border-collapse text-left">
        <thead>
          <tr class="border-b border-line text-xs font-medium text-muted">
            <th class="px-3 py-3">Nama pasien</th>
            <th class="px-3 py-3">Email</th>
            <th class="px-3 py-3">Kondisi</th>
            <th class="px-3 py-3">Nomor telepon</th>
            <th class="px-3 py-3">Tanggal lahir</th>
            <th class="px-3 py-3">Jenis kelamin</th>
            <th class="px-3 py-3">Catatan awal</th>
            <th class="px-3 py-3">Alamat</th>
            <th class="px-3 py-3 text-center">Sesi terapi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line/70">
          <tr v-for="patient in patients" :key="patient.id" class="align-top text-sm text-ink hover:bg-base/50">
            <td class="whitespace-nowrap px-3 py-5 font-medium">
              <button
                class="text-left text-primary-dark hover:text-primary hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                type="button"
                :aria-label="`Lihat dan lengkapi data ${patient.namaLengkap || 'pasien'}`"
                @click="emit('select', patient)"
              >
                {{ patient.namaLengkap || 'Tidak tersedia' }}
              </button>
              <span class="mt-1 block text-xs font-normal text-muted">Lihat / lengkapi data</span>
            </td>
            <td class="px-3 py-5">{{ patient.user?.email || 'Tidak tersedia' }}</td>
            <td class="max-w-60 px-3 py-5">
              <span class="block max-w-56 truncate">{{ patient.kondisiMedis || 'Belum dicantumkan' }}</span>
            </td>
            <td class="whitespace-nowrap px-3 py-5">{{ patient.nomorTelepon || 'Tidak tersedia' }}</td>
            <td class="whitespace-nowrap px-3 py-5">{{ patient.tanggalLahir ? new Date(patient.tanggalLahir).toLocaleDateString('id-ID') : 'Tidak tersedia' }}</td>
            <td class="whitespace-nowrap px-3 py-5">{{ formatGender(patient.jenisKelamin) }}</td>
            <td class="max-w-72 px-3 py-5">
              <span class="block max-w-64 truncate">{{ patient.catatanAwal || 'Belum ada catatan awal.' }}</span>
            </td>
            <td class="max-w-72 px-3 py-5">
              <span class="block max-w-64 truncate">{{ patient.alamat || 'Tidak tersedia' }}</span>
            </td>
            <td class="px-3 py-5 text-center">{{ patient._count?.therapySessions ?? 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
