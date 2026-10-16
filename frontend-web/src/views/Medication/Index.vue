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
const showScheduleModal = ref(false)
const medicationSchedules = ref([])
const scheduleSequence = ref(0)
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

function formatDate(date) {
  if (!date) return '—'
  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function openScheduleModal() {
  error.value = ''
  notice.value = ''
  showScheduleModal.value = true
}

function closeScheduleModal() {
  if (busy.value) return
  showScheduleModal.value = false
  error.value = ''
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

    const schedule = response?.data ?? response ?? {}
    medicationSchedules.value.unshift({
      id: schedule.id ?? `local-${++scheduleSequence.value}`,
      patientName: monitoringData.patients.find((patient) => patient.id === form.patientId)?.namaLengkap
        || 'Pasien',
      medicationName: schedule.medicationName ?? form.medicationName.trim(),
      dosage: schedule.dosage ?? form.dosage.trim(),
      frequency: schedule.frequency ?? form.frequency.trim(),
      timeToTake: schedule.timeToTake ?? [...form.timeToTake],
      startDate: schedule.startDate ?? form.startDate,
      endDate: schedule.endDate ?? form.endDate,
    })
    notice.value = response?.message || 'Jadwal obat berhasil dibuat.'
    form.medicationName = ''
    form.dosage = ''
    form.frequency = ''
    form.timeToTake = ['08:00']
    form.startDate = today
    form.endDate = today
    showScheduleModal.value = false
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
    >
      <template #actions>
        <button
          class="min-h-11 w-full rounded-control bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark sm:w-auto"
          type="button"
          @click="openScheduleModal"
        >
          Buatkan resep
        </button>
      </template>
    </PageHeader>

    <p v-if="notice" class="rounded-panel border border-success/25 bg-success/5 p-3 text-sm text-success" role="status">
      {{ notice }}
    </p>

    <div
      v-if="showScheduleModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      @click.self="closeScheduleModal"
    >
      <section
        class="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-card border border-line bg-surface p-5 shadow-2xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="medication-modal-title"
      >
        <header class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="medication-modal-title" class="text-lg font-semibold text-primary-dark">Buatkan resep obat</h2>
            <p class="mt-1 text-sm text-muted">Isi informasi obat dan jadwal konsumsinya.</p>
          </div>
          <button
            class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted hover:bg-base hover:text-ink disabled:opacity-50"
            type="button"
            aria-label="Tutup popup"
            :disabled="busy"
            @click="closeScheduleModal"
          >
            ×
          </button>
        </header>
        <p v-if="error" class="mb-4 rounded-panel border border-danger/25 bg-danger/5 p-3 text-sm text-danger" role="alert">
          {{ error }}
        </p>

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
            @click="closeScheduleModal"
          >
            Buka daftar pasien
          </RouterLink>
        </EmptyState>

        <form v-else class="grid gap-5 lg:grid-cols-2" @submit.prevent="submitSchedule">
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
      </section>
    </div>

    <SurfaceCard>
      <header class="mb-3 flex items-center justify-between gap-3">
        <div>
          <p class="mb-1 text-xs font-medium text-primary">Data perawatan</p>
          <h2 class="text-lg font-semibold text-primary-dark">Jadwal obat yang dibuat</h2>
        </div>
        <span class="text-sm text-muted">{{ medicationSchedules.length }} jadwal</span>
      </header>
      <EmptyState
        v-if="!medicationSchedules.length"
        title="Belum ada jadwal obat"
        description="Jadwal yang berhasil disimpan akan muncul di tabel ini."
      />
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr class="border-b border-line text-xs font-medium text-muted">
              <th class="px-3 py-3">Pasien</th>
              <th class="px-3 py-3">Obat</th>
              <th class="px-3 py-3">Dosis</th>
              <th class="px-3 py-3">Frekuensi</th>
              <th class="px-3 py-3">Waktu konsumsi</th>
              <th class="px-3 py-3">Periode</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line/70">
            <tr v-for="schedule in medicationSchedules" :key="schedule.id" class="text-sm text-ink hover:bg-base/50">
              <td class="whitespace-nowrap px-3 py-3 font-medium text-primary-dark">{{ schedule.patientName }}</td>
              <td class="px-3 py-3">{{ schedule.medicationName }}</td>
              <td class="whitespace-nowrap px-3 py-3">{{ schedule.dosage }}</td>
              <td class="whitespace-nowrap px-3 py-3">{{ schedule.frequency }}</td>
              <td class="whitespace-nowrap px-3 py-3">{{ schedule.timeToTake.join(', ') }}</td>
              <td class="whitespace-nowrap px-3 py-3">
                {{ formatDate(schedule.startDate) }} – {{ formatDate(schedule.endDate) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-4 border-t border-line pt-3 text-xs leading-5 text-muted">
        Tabel ini menampilkan jadwal yang berhasil dibuat selama halaman ini dibuka. Daftar jadwal historis belum tersedia dari endpoint Nakes.
      </p>
    </SurfaceCard>
  </div>
</template>
