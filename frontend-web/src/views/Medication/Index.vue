<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import EmptyState from '../../components/ui/EmptyState.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import SurfaceCard from '../../components/ui/SurfaceCard.vue'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import { getSession } from '../../services/auth.api'
import { createMedicationSchedule } from '../../services/medication.api'

const token = getSession()?.token
const busy = ref(false)
const error = ref('')
const notice = ref('')
const createdSchedule = ref(null)
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const form = reactive({
  patientId: '',
  medicationName: '',
  dosage: '',
  frequency: '',
  timeToTake: ['08:00'],
  startDate: today,
  endDate: today,
})

const canSubmit = computed(() =>
  Boolean(
    token
    && monitoringData.patients.length
    && form.patientId
    && form.medicationName.trim()
    && form.dosage.trim()
    && form.frequency.trim()
    && form.timeToTake.length
    && form.timeToTake.every((time) => time.trim())
    && form.startDate
    && form.endDate
    && form.endDate >= form.startDate,
  ),
)

function addTime() {
  form.timeToTake.push('')
}

function removeTime(index) {
  if (form.timeToTake.length === 1) return
  form.timeToTake.splice(index, 1)
}

async function submitSchedule() {
  error.value = ''
  notice.value = ''
  if (!token) {
    error.value = 'Sesi login tidak ditemukan. Silakan login kembali.'
    return
  }
  if (!canSubmit.value) {
    error.value = 'Lengkapi data jadwal dan pastikan tanggal akhir tidak sebelum tanggal mulai.'
    return
  }

  busy.value = true
  try {
    const response = await createMedicationSchedule({
      patientId: form.patientId,
      medicationName: form.medicationName.trim(),
      dosage: form.dosage.trim(),
      frequency: form.frequency.trim(),
      timeToTake: form.timeToTake.map((time) => time.trim()),
      startDate: form.startDate,
      endDate: form.endDate,
    }, token)

    createdSchedule.value = response?.data ?? response
    notice.value = response?.message || 'Jadwal obat berhasil dibuat.'
    form.medicationName = ''
    form.dosage = ''
    form.frequency = ''
    form.timeToTake = ['08:00']
    form.startDate = today
    form.endDate = today
  } catch (requestError) {
    error.value = requestError?.message || 'Jadwal obat gagal dibuat. Coba lagi.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Perawatan pasien"
      title="Jadwal obat"
      description="Buat jadwal konsumsi obat untuk pasien yang terhubung dengan akun Nakes Anda."
    />

    <p v-if="notice" class="rounded-panel border border-success/25 bg-success/5 p-3 text-sm text-success" role="status">
      {{ notice }}
    </p>
    <p v-if="error" class="rounded-panel border border-danger/25 bg-danger/5 p-3 text-sm text-danger" role="alert">
      {{ error }}
    </p>

    <SurfaceCard>
      <div v-if="monitoringData.loading && !monitoringData.patients.length" class="flex min-h-40 items-center justify-center gap-3 text-sm text-muted" role="status">
        <span class="size-5 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" aria-hidden="true" />
        Memuat daftar pasien…
      </div>
      <div v-else-if="monitoringData.error && !monitoringData.patients.length" class="grid min-h-40 place-content-center justify-items-center gap-3 text-center">
        <p class="max-w-lg text-sm text-danger" role="alert">{{ monitoringData.error }}</p>
        <button
          class="min-h-10 rounded-control border border-line px-4 text-sm font-semibold text-primary hover:bg-base"
          type="button"
          @click="refreshMonitoringData(token)"
        >
          Coba lagi
        </button>
      </div>
      <EmptyState
        v-else-if="!monitoringData.patients.length"
        title="Belum ada pasien terhubung"
        description="Hubungkan pasien terlebih dahulu sebelum membuat jadwal obat."
      >
        <RouterLink
          class="mt-3 inline-flex min-h-10 items-center rounded-control bg-primary px-4 text-sm font-semibold text-white no-underline hover:bg-primary-dark"
          :to="{ name: 'monitoring-patients' }"
        >
          Buka daftar pasien
        </RouterLink>
      </EmptyState>

      <form v-else class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]" @submit.prevent="submitSchedule">
        <div class="space-y-4">
          <label class="grid gap-2 text-sm font-medium text-primary-dark">
            Pasien
            <select
              v-model="form.patientId"
              class="min-h-11 rounded-control border border-line bg-surface px-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              required
              :disabled="busy || monitoringData.loading"
            >
              <option value="" disabled>Pilih pasien</option>
              <option v-for="patient in monitoringData.patients" :key="patient.id" :value="patient.id">
                {{ patient.namaLengkap }} · {{ patient.user?.email || 'Tanpa email' }}
              </option>
            </select>
          </label>

          <label class="grid gap-2 text-sm font-medium text-primary-dark">
            Nama obat
            <input
              v-model="form.medicationName"
              class="min-h-11 rounded-control border border-line bg-surface px-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              type="text"
              maxlength="100"
              autocomplete="off"
              placeholder="Contoh: Paracetamol"
              required
              :disabled="busy"
            >
          </label>

          <label class="grid gap-2 text-sm font-medium text-primary-dark">
            Dosis
            <input
              v-model="form.dosage"
              class="min-h-11 rounded-control border border-line bg-surface px-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              type="text"
              autocomplete="off"
              placeholder="Contoh: 500 mg"
              required
              :disabled="busy"
            >
          </label>

          <label class="grid gap-2 text-sm font-medium text-primary-dark">
            Frekuensi
            <input
              v-model="form.frequency"
              class="min-h-11 rounded-control border border-line bg-surface px-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              type="text"
              autocomplete="off"
              placeholder="Contoh: 2 kali sehari"
              required
              :disabled="busy"
            >
          </label>
        </div>

        <div class="space-y-4">
          <fieldset class="space-y-3">
            <legend class="mb-2 text-sm font-medium text-primary-dark">Waktu konsumsi</legend>
            <div v-for="(time, index) in form.timeToTake" :key="index" class="flex items-center gap-2">
              <label class="sr-only" :for="`medication-time-${index}`">Waktu konsumsi {{ index + 1 }}</label>
              <input
                :id="`medication-time-${index}`"
                v-model="form.timeToTake[index]"
                class="min-h-11 min-w-0 flex-1 rounded-control border border-line bg-surface px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                type="time"
                required
                :disabled="busy"
              >
              <button
                v-if="form.timeToTake.length > 1"
                class="min-h-11 rounded-control border border-line px-3 text-sm text-muted hover:bg-base disabled:opacity-50"
                type="button"
                :disabled="busy"
                :aria-label="`Hapus waktu konsumsi ${index + 1}`"
                @click="removeTime(index)"
              >
                Hapus
              </button>
            </div>
            <button
              class="min-h-10 rounded-control border border-line px-3 text-sm font-medium text-primary hover:bg-base disabled:opacity-50"
              type="button"
              :disabled="busy"
              @click="addTime"
            >
              + Tambah waktu
            </button>
          </fieldset>

          <label class="grid gap-2 text-sm font-medium text-primary-dark">
            Tanggal mulai
            <input
              v-model="form.startDate"
              class="min-h-11 rounded-control border border-line bg-surface px-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              type="date"
              required
              :disabled="busy"
            >
          </label>

          <label class="grid gap-2 text-sm font-medium text-primary-dark">
            Tanggal berakhir
            <input
              v-model="form.endDate"
              class="min-h-11 rounded-control border border-line bg-surface px-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              type="date"
              :min="form.startDate"
              required
              :disabled="busy"
            >
          </label>

          <button
            class="min-h-11 w-full rounded-control bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            :disabled="busy || !canSubmit"
          >
            {{ busy ? 'Menyimpan…' : 'Simpan jadwal obat' }}
          </button>
        </div>
      </form>
    </SurfaceCard>

    <SurfaceCard v-if="createdSchedule">
      <h2 class="text-lg font-semibold text-primary-dark">Jadwal berhasil disimpan</h2>
      <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt class="text-muted">Obat</dt>
          <dd class="font-medium text-ink">{{ createdSchedule.medicationName }}</dd>
        </div>
        <div>
          <dt class="text-muted">Dosis</dt>
          <dd class="font-medium text-ink">{{ createdSchedule.dosage }}</dd>
        </div>
        <div>
          <dt class="text-muted">Frekuensi</dt>
          <dd class="font-medium text-ink">{{ createdSchedule.frequency }}</dd>
        </div>
        <div>
          <dt class="text-muted">Waktu</dt>
          <dd class="font-medium text-ink">{{ createdSchedule.timeToTake?.join(', ') }}</dd>
        </div>
      </dl>
      <p class="mt-4 border-t border-line pt-3 text-xs leading-5 text-muted">
        Jadwal tersimpan di backend. Endpoint Nakes saat ini belum menyediakan daftar, perubahan, atau penghapusan jadwal.
      </p>
    </SurfaceCard>
  </div>
</template>
