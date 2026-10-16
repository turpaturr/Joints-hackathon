<script setup>
const props = defineProps({
  prescriptions: { type: Array, required: true },
  patients: { type: Array, required: true },
  busy: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete'])

function patientName(patientId) {
  return props.patients.find((patient) => patient.id === patientId)?.namaLengkap
    || `Pasien ${patientId.slice(0, 8)}`
}

function formatStartDay(date) {
  if (!date) return 'Hari mulai belum ditentukan'
  const dateValue = typeof date === 'string' && date.length >= 10
    ? new Date(`${date.slice(0, 10)}T12:00:00`)
    : new Date(date)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateValue)
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[900px] border-collapse text-left">
      <thead>
        <tr class="border-b border-line text-xs font-medium text-muted">
          <th class="px-3 py-3">Pasien</th>
          <th class="px-3 py-3">Gerakan</th>
          <th class="px-3 py-3">Target</th>
          <th class="px-3 py-3">Frekuensi</th>
          <th class="px-3 py-3">Hari mulai</th>
          <th class="px-3 py-3">Periode terapi</th>
          <th class="px-3 py-3">Dibuat</th>
          <th class="px-3 py-3 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line/70">
        <tr v-for="plan in prescriptions" :key="plan.id" class="text-sm text-ink hover:bg-base/50">
          <td class="whitespace-nowrap px-3 py-3 font-medium text-primary-dark">{{ patientName(plan.patientId) }}</td>
          <td class="px-3 py-3">{{ plan.movement?.namaGerakan || 'Gerakan terapi' }}</td>
          <td class="whitespace-nowrap px-3 py-3">{{ plan.targetRepetisi }} repetisi</td>
          <td class="whitespace-nowrap px-3 py-3">{{ plan.frekuensiPerHari }}× sehari</td>
          <td class="whitespace-nowrap px-3 py-3 capitalize">{{ formatStartDay(plan.tanggalMulai) }}</td>
          <td class="whitespace-nowrap px-3 py-3">
            {{ new Date(plan.tanggalMulai).toLocaleDateString('id-ID') }} – {{ new Date(plan.tanggalBerakhir).toLocaleDateString('id-ID') }}
          </td>
          <td class="whitespace-nowrap px-3 py-3 text-muted">{{ formatDate(plan.createdAt || plan.tanggalMulai) }}</td>
          <td class="whitespace-nowrap px-3 py-3">
            <div class="flex justify-end gap-2">
              <button
                class="min-h-9 rounded-control border border-line px-3 text-xs font-semibold text-primary transition hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50"
                type="button"
                :disabled="busy"
                @click="$emit('edit', plan)"
              >
                Edit
              </button>
              <button
                class="min-h-9 rounded-control border border-danger/25 px-3 text-xs font-semibold text-danger transition hover:bg-danger/5 disabled:opacity-50"
                type="button"
                :disabled="busy"
                @click="$emit('delete', plan)"
              >
                Hapus
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
