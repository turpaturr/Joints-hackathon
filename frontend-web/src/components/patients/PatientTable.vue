<script setup>
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
  <div class="overflow-x-auto">
    <table class="w-full min-w-[1320px] border-collapse text-left">
      <caption class="sr-only">Informasi pasien dalam pemantauan</caption>
      <thead>
        <tr class="border-b border-line text-xs font-medium text-muted">
          <th class="whitespace-nowrap px-3 py-3">Nama pasien</th>
          <th class="px-3 py-3">Email</th>
          <th class="px-3 py-3">Kondisi medis</th>
          <th class="whitespace-nowrap px-3 py-3">Nomor telepon</th>
          <th class="whitespace-nowrap px-3 py-3">Tanggal lahir</th>
          <th class="whitespace-nowrap px-3 py-3">Jenis kelamin</th>
          <th class="px-3 py-3">Catatan awal</th>
          <th class="px-3 py-3">Alamat</th>
          <th class="whitespace-nowrap px-3 py-3 text-center">Sesi terapi</th>
          <th class="px-3 py-3 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line/70">
        <tr v-for="patient in patients" :key="patient.id" class="text-sm text-ink hover:bg-base/50">
          <td class="whitespace-nowrap px-3 py-3 font-medium text-primary-dark">
            <button
              class="text-left text-primary-dark hover:underline"
              type="button"
              @click="emit('select', patient)"
            >{{ patient.namaLengkap || 'Tidak tersedia' }}</button>
          </td>
          <td class="px-3 py-3">{{ patient.user?.email || 'Tidak tersedia' }}</td>
          <td class="max-w-60 px-3 py-3">
            <button
              v-if="patient.kondisiMedis"
              class="block max-w-56 truncate text-left text-ink hover:text-primary hover:underline"
              type="button"
              :title="patient.kondisiMedis"
              @click="showLongText('Kondisi', patient.kondisiMedis, patient.namaLengkap)"
            >
              {{ patient.kondisiMedis }}
            </button>
            <span v-else>Belum dicantumkan</span>
          </td>
          <td class="whitespace-nowrap px-3 py-3">{{ patient.nomorTelepon || 'Tidak tersedia' }}</td>
          <td class="whitespace-nowrap px-3 py-3">{{ patient.tanggalLahir ? new Date(patient.tanggalLahir).toLocaleDateString('id-ID') : 'Tidak tersedia' }}</td>
          <td class="whitespace-nowrap px-3 py-3">{{ formatGender(patient.jenisKelamin) }}</td>
          <td class="max-w-72 px-3 py-3">
            <button
              v-if="patient.catatanAwal"
              class="block max-w-64 truncate text-left text-ink hover:text-primary hover:underline"
              type="button"
              :title="patient.catatanAwal"
              @click="showLongText('Catatan awal', patient.catatanAwal, patient.namaLengkap)"
            >{{ patient.catatanAwal }}</button>
            <span v-else>Belum ada catatan awal</span>
          </td>
          <td class="max-w-72 px-3 py-3">
            <button
              v-if="patient.alamat"
              class="block max-w-64 truncate text-left text-ink hover:text-primary hover:underline"
              type="button"
              :title="patient.alamat"
              @click="showLongText('Alamat', patient.alamat, patient.namaLengkap)"
            >{{ patient.alamat }}</button>
            <span v-else>Tidak tersedia</span>
          </td>
          <td class="whitespace-nowrap px-3 py-3 text-center">{{ patient._count?.therapySessions ?? 0 }} sesi</td>
          <td class="whitespace-nowrap px-3 py-3">
            <div class="flex justify-end gap-2">
              <button
                class="min-h-9 rounded-control border border-line px-3 text-xs font-semibold text-primary transition hover:border-primary/30 hover:bg-primary/5"
                type="button"
                :aria-label="`Edit data klinis ${patient.namaLengkap || 'pasien'}`"
                @click="emit('select', patient)"
              >
                Edit
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
