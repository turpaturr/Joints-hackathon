<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  patient: { type: Object, default: null },
  error: { type: String, default: '' },
  saving: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'save'])
const patientForm = reactive({
  kondisiMedis: '',
  riwayatPenyakit: '',
  alergi: '',
  lokasiKeluhan: '',
  sisiTubuh: '',
  tanggalMulaiKeluhan: '',
  skalaNyeri: '',
  catatanAwal: '',
})
const fieldLabelClass = 'mb-1.5 block text-sm font-medium text-primary-dark'
const fieldInputClass = 'min-h-11 w-full rounded-control border border-line bg-surface px-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-base'
const fieldTextareaClass = 'min-h-24 w-full resize-y rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-base'

watch(
  () => props.patient,
  (patient) => {
    if (!patient) return
    Object.assign(patientForm, {
      kondisiMedis: patient.kondisiMedis || '',
      riwayatPenyakit: patient.riwayatPenyakit || '',
      alergi: patient.alergi || '',
      lokasiKeluhan: patient.lokasiKeluhan || '',
      sisiTubuh: patient.sisiTubuh || '',
      tanggalMulaiKeluhan: patient.tanggalMulaiKeluhan
        ? new Date(patient.tanggalMulaiKeluhan).toISOString().slice(0, 10)
        : '',
      skalaNyeri: patient.skalaNyeri === null || patient.skalaNyeri === undefined
        ? ''
        : String(patient.skalaNyeri),
      catatanAwal: patient.catatanAwal || '',
    })
  },
  { immediate: true },
)

function submit() {
  const patientData = Object.fromEntries(
    Object.entries(patientForm)
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() || null : value]),
  )
  if (patientData.skalaNyeri !== null) {
    patientData.skalaNyeri = Number(patientData.skalaNyeri)
  }
  if (patientData.tanggalMulaiKeluhan) {
    patientData.tanggalMulaiKeluhan = new Date(`${patientData.tanggalMulaiKeluhan}T00:00:00`).toISOString()
  }
  emit('save', patientData)
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="presentation"
    @click.self="emit('close')"
  >
    <section
      aria-labelledby="patient-details-title"
      aria-modal="true"
      class="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-line bg-surface shadow-[var(--connect-shadow-card)]"
      role="dialog"
    >
      <header class="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div class="min-w-0">
          <p class="mb-1 text-xs font-medium text-primary">PROFIL PASIEN</p>
          <h2 id="patient-details-title" class="text-lg font-semibold text-primary-dark">{{ patient?.namaLengkap || 'Data pasien' }}</h2>
          <p class="mt-1 text-sm text-muted">{{ patient?.user?.email || 'Lengkapi informasi klinis pasien.' }}</p>
        </div>
        <button
          aria-label="Tutup data pasien"
          class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted transition hover:bg-base hover:text-ink disabled:opacity-50"
          type="button"
          :disabled="saving"
          @click="emit('close')"
        >
          ×
        </button>
      </header>

      <form class="min-h-0 flex-1 overflow-y-auto" @submit.prevent="submit">
        <div class="space-y-4 p-5 sm:p-6">
          <fieldset class="rounded-panel border border-line p-4 sm:p-5">
            <legend class="px-1 text-sm font-semibold text-primary-dark">Kondisi kesehatan</legend>
            <div class="grid gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <label :class="fieldLabelClass" for="patient-condition">Kondisi medis</label>
                <input id="patient-condition" v-model="patientForm.kondisiMedis" :class="fieldInputClass" type="text" placeholder="Contoh: osteoarthritis" :disabled="saving">
              </div>
              <div>
                <label :class="fieldLabelClass" for="patient-allergies">Alergi</label>
                <input id="patient-allergies" v-model="patientForm.alergi" :class="fieldInputClass" type="text" placeholder="Tuliskan alergi yang diketahui" :disabled="saving">
              </div>
              <div class="sm:col-span-2">
                <label :class="fieldLabelClass" for="patient-history">Riwayat penyakit</label>
                <textarea id="patient-history" v-model="patientForm.riwayatPenyakit" :class="fieldTextareaClass" rows="3" placeholder="Riwayat penyakit atau tindakan medis sebelumnya" :disabled="saving" />
              </div>
            </div>
          </fieldset>
          <fieldset class="rounded-panel border border-line p-4 sm:p-5">
            <legend class="px-1 text-sm font-semibold text-primary-dark">Keluhan pasien</legend>
            <div class="grid gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <label :class="fieldLabelClass" for="patient-complaint-location">Lokasi keluhan</label>
                <input id="patient-complaint-location" v-model="patientForm.lokasiKeluhan" :class="fieldInputClass" type="text" placeholder="Contoh: lutut" :disabled="saving">
              </div>
              <div>
                <label :class="fieldLabelClass" for="patient-body-side">Sisi tubuh</label>
                <input id="patient-body-side" v-model="patientForm.sisiTubuh" :class="fieldInputClass" type="text" placeholder="Kiri, kanan, atau keduanya" :disabled="saving">
              </div>
              <div>
                <label :class="fieldLabelClass" for="patient-onset-date">Mulai dirasakan</label>
                <input id="patient-onset-date" v-model="patientForm.tanggalMulaiKeluhan" :class="fieldInputClass" type="date" :disabled="saving">
              </div>
              <div>
                <span id="patient-pain-scale-label" :class="fieldLabelClass">Skala nyeri <span class="font-normal text-muted">(0–10)</span></span>
                <div class="grid grid-cols-6 gap-2 pt-1 sm:grid-cols-11" role="group" aria-labelledby="patient-pain-scale-label">
                  <button
                    v-for="score in 11"
                    :key="score - 1"
                    class="min-h-10 rounded-control border text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                    :class="patientForm.skalaNyeri === String(score - 1)
                      ? 'border-primary bg-primary text-white'
                      : 'border-line bg-surface text-primary-dark hover:border-primary hover:bg-base'"
                    type="button"
                    :aria-label="`Skala nyeri ${score - 1}`"
                    :aria-pressed="patientForm.skalaNyeri === String(score - 1)"
                    :disabled="saving"
                    @click="patientForm.skalaNyeri = String(score - 1)"
                  >
                    {{ score - 1 }}
                  </button>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label :class="fieldLabelClass" for="patient-initial-notes">Catatan awal</label>
                <textarea id="patient-initial-notes" v-model="patientForm.catatanAwal" :class="fieldTextareaClass" rows="3" placeholder="Catatan tambahan tentang kondisi pasien" :disabled="saving" />
              </div>
            </div>
          </fieldset>
        </div>
        <p v-if="error" class="mx-5 mb-4 rounded-control border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger sm:mx-6" role="alert">
          {{ error }}
        </p>
        <footer class="sticky bottom-0 flex shrink-0 flex-col-reverse gap-2 border-t border-line bg-surface px-5 py-4 sm:flex-row sm:justify-between sm:px-6">
          <p class="self-center text-xs text-muted">Perubahan disimpan ke profil pasien.</p>
          <div class="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              class="min-h-11 rounded-control border border-line px-5 text-sm font-semibold text-primary-dark transition hover:bg-base disabled:opacity-50"
              type="button"
              :disabled="saving"
              @click="emit('close')"
            >
              Tutup
            </button>
            <button
              class="min-h-11 rounded-control bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
              type="submit"
              :disabled="saving"
            >
              {{ saving ? 'Menyimpan…' : 'Simpan data' }}
            </button>
          </div>
        </footer>
      </form>
    </section>
  </div>
</template>
