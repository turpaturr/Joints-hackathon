<script setup>
import { computed, reactive } from 'vue'

const props = defineProps({
  patients: { type: Array, required: true },
  movements: { type: Array, required: true },
  prescription: { type: Object, default: null },
  busy: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'submit'])

function dateInputValue(value) {
  if (!value) return ''
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const prescriptionForm = reactive({
  patientId: props.prescription?.patientId || '',
  movementId: props.prescription?.movementId || '',
  targetRepetisi: props.prescription?.targetRepetisi ?? 10,
  frekuensiPerHari: props.prescription?.frekuensiPerHari ?? 2,
  tanggalMulai: props.prescription
    ? dateInputValue(props.prescription.tanggalMulai)
    : new Date().toISOString().slice(0, 10),
  tanggalBerakhir: props.prescription
    ? dateInputValue(props.prescription.tanggalBerakhir)
    : '',
})
const hariMulai = computed(() => {
  if (!prescriptionForm.tanggalMulai) return ''
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(
    new Date(`${prescriptionForm.tanggalMulai}T12:00:00`),
  )
})
const selectedMovement = computed(() =>
  props.movements.find((movement) => movement.id === prescriptionForm.movementId),
)

function submitPrescription() {
  if (
    !prescriptionForm.patientId
    || !prescriptionForm.movementId
    || !prescriptionForm.tanggalMulai
    || !prescriptionForm.tanggalBerakhir
    || prescriptionForm.tanggalBerakhir < prescriptionForm.tanggalMulai
  ) return

  emit('submit', {
    patientId: prescriptionForm.patientId,
    movementId: prescriptionForm.movementId,
    targetRepetisi: Number(prescriptionForm.targetRepetisi),
    frekuensiPerHari: Number(prescriptionForm.frekuensiPerHari),
    tanggalMulai: new Date(`${prescriptionForm.tanggalMulai}T00:00:00`).toISOString(),
    tanggalBerakhir: new Date(`${prescriptionForm.tanggalBerakhir}T23:59:59`).toISOString(),
  })
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" @click.self="!busy && $emit('close')">
    <section aria-labelledby="prescription-modal-title" aria-modal="true" class="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-card border border-line bg-surface p-5 shadow-[var(--connect-shadow-card)] sm:p-6" role="dialog">
      <header class="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="prescription-modal-title" class="text-lg font-semibold text-primary-dark">
            {{ prescription ? 'Edit resep terapi' : 'Hubungkan gerakan ke pasien' }}
          </h2>
          <p class="mt-1 text-sm text-muted">Pilih pasien, gerakan, dan target program terapi.</p>
        </div>
        <button aria-label="Tutup popup" class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted hover:bg-base hover:text-ink disabled:opacity-50" type="button" :disabled="busy" @click="$emit('close')">×</button>
      </header>
      <p v-if="error" class="mb-4 rounded-panel border border-danger/25 bg-danger/5 p-3 text-sm text-danger" role="alert">{{ error }}</p>
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="submitPrescription">
        <label class="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
          Pasien
          <select v-model="prescriptionForm.patientId" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" required>
            <option value="" disabled>Pilih pasien</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">{{ patient.namaLengkap }} · {{ patient.user?.email }}</option>
          </select>
        </label>
        <label class="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
          Jenis gerakan
          <select v-model="prescriptionForm.movementId" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" required>
            <option value="" disabled>Pilih gerakan</option>
            <option v-for="movement in movements" :key="movement.id" :value="movement.id">{{ movement.namaGerakan }}</option>
          </select>
        </label>
        <div v-if="selectedMovement" class="grid gap-3 sm:col-span-2 sm:grid-cols-2">
          <img
            v-if="selectedMovement.imageBase64"
            class="max-h-56 w-full rounded-panel border border-line bg-base object-contain"
            :src="`data:${selectedMovement.imageMimeType || 'image/jpeg'};base64,${selectedMovement.imageBase64}`"
            :alt="`Gambar gerakan ${selectedMovement.namaGerakan}`"
          />
          <a
            v-if="selectedMovement.youtubeUrl || selectedMovement.mediaUrl"
            class="flex min-h-20 items-center justify-center gap-2 rounded-panel border border-line bg-base px-3 text-sm font-medium text-primary hover:bg-primary/5"
            :href="selectedMovement.youtubeUrl || selectedMovement.mediaUrl"
            target="_blank"
            rel="noreferrer"
          >
            <span aria-hidden="true">▶</span>
            Lihat video gerakan
          </a>
          <p
            v-if="!selectedMovement.imageBase64 && !selectedMovement.youtubeUrl && !selectedMovement.mediaUrl"
            class="text-sm text-muted sm:col-span-2"
          >
            Gerakan ini belum memiliki media.
          </p>
        </div>
        <label class="grid gap-2 text-sm font-medium text-ink">
          Target repetisi
          <input v-model.number="prescriptionForm.targetRepetisi" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="number" min="1" required />
        </label>
        <label class="grid gap-2 text-sm font-medium text-ink">
          Frekuensi per hari
          <input v-model.number="prescriptionForm.frekuensiPerHari" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="number" min="1" required />
        </label>
        <label class="grid gap-2 text-sm font-medium text-ink">
          Tanggal mulai
          <input v-model="prescriptionForm.tanggalMulai" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="date" required />
        </label>
        <label class="grid gap-2 text-sm font-medium text-ink">
          Hari mulai
          <input :value="hariMulai || 'Pilih tanggal mulai'" class="min-h-11 rounded-control border border-line bg-base px-3 text-sm font-normal text-muted" type="text" readonly aria-readonly="true" />
        </label>
        <label class="grid gap-2 text-sm font-medium text-ink">
          Tanggal berakhir
          <input v-model="prescriptionForm.tanggalBerakhir" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="date" :min="prescriptionForm.tanggalMulai" required />
        </label>
        <p v-if="!patients.length || !movements.length" class="text-sm leading-6 text-muted sm:col-span-2">
          Penugasan memerlukan pasien yang terhubung dan setidaknya satu gerakan di pustaka.
        </p>
        <p v-if="prescriptionForm.tanggalBerakhir && prescriptionForm.tanggalBerakhir < prescriptionForm.tanggalMulai" class="text-sm text-danger sm:col-span-2" role="alert">
          Tanggal berakhir harus sama dengan atau setelah tanggal mulai.
        </p>
        <div class="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
          <button class="min-h-11 rounded-panel border border-line px-4 text-sm font-semibold text-primary-dark hover:bg-base disabled:opacity-50" type="button" :disabled="busy" @click="$emit('close')">Batal</button>
          <button class="min-h-11 rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:bg-disabled" type="submit" :disabled="busy || !patients.length || !movements.length || (prescriptionForm.tanggalBerakhir && prescriptionForm.tanggalBerakhir < prescriptionForm.tanggalMulai)">
            {{ busy ? 'Menyimpan…' : prescription ? 'Simpan perubahan' : 'Hubungkan ke pasien' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
