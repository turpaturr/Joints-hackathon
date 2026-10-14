<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  patients: { type: Array, required: true },
})

const emit = defineEmits(['open-text', 'select'])

function formatGender(value) {
  const normalized = value?.trim().toUpperCase()
  if (normalized === 'LAKI_LAKI') return 'Pria'
  if (normalized === 'PEREMPUAN') return 'Wanita'
  return value || 'Tidak tersedia'
}
function showLongText(title, content, patientName) {
  emit('open-text', { title, content, patientName })
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
            <th class="sticky right-0 bg-surface px-3 py-3 text-right">Detail</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line/70">
          <tr v-for="patient in patients" :key="patient.id" class="align-top text-sm text-ink hover:bg-base/50">
            <td class="whitespace-nowrap px-3 py-5 font-medium">
              <button
                class="text-left text-primary-dark hover:underline"
                type="button"
                @click="emit('select', patient)"
              >{{ patient.namaLengkap || 'Tidak tersedia' }}</button>
            </td>
            <td class="px-3 py-5">{{ patient.user?.email || 'Tidak tersedia' }}</td>
            <td class="max-w-60 px-3 py-5">
              <button
                v-if="patient.kondisiMedis"
                class="block max-w-56 truncate text-left text-primary hover:underline"
                type="button"
                @click="showLongText('Kondisi', patient.kondisiMedis, patient.namaLengkap)"
              >
                {{ patient.kondisiMedis }}
              </button>
              <span v-else>Belum dicantumkan</span>
            </td>
            <td class="whitespace-nowrap px-3 py-5">{{ patient.nomorTelepon || 'Tidak tersedia' }}</td>
            <td class="whitespace-nowrap px-3 py-5">{{ patient.tanggalLahir ? new Date(patient.tanggalLahir).toLocaleDateString('id-ID') : 'Tidak tersedia' }}</td>
            <td class="whitespace-nowrap px-3 py-5">{{ formatGender(patient.jenisKelamin) }}</td>
            <td class="max-w-72 px-3 py-5">
              <button
                v-if="patient.catatanAwal"
                class="block max-w-64 truncate text-left text-primary hover:underline"
                type="button"
                @click="showLongText('Catatan awal', patient.catatanAwal, patient.namaLengkap)"
              >{{ patient.catatanAwal }}</button>
              <span v-else>Belum ada catatan awal.</span>
            </td>
            <td class="max-w-72 px-3 py-5">
              <button
                v-if="patient.alamat"
                class="block max-w-64 truncate text-left text-primary hover:underline"
                type="button"
                @click="showLongText('Alamat', patient.alamat, patient.namaLengkap)"
              >{{ patient.alamat }}</button>
              <span v-else>Tidak tersedia</span>
            </td>
            <td class="px-3 py-5 text-center">{{ patient._count?.therapySessions ?? 0 }}</td>
            <td class="sticky right-0 bg-surface px-3 py-5 text-right">
              <button
                class="inline-flex min-h-9 items-center whitespace-nowrap rounded-control px-3 text-xs font-semibold text-primary transition hover:bg-primary/5"
                type="button"
                @click="emit('select', patient)"
              >Edit data klinis</button>
              <RouterLink
                class="ml-1 inline-flex min-h-9 items-center whitespace-nowrap rounded-control px-3 text-xs font-semibold text-primary transition hover:bg-primary/5"
                :to="{ name: 'monitoring-patient-detail', params: { patientId: patient.id } }"
              >Detail →</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
