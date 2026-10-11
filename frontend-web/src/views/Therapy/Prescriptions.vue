<script setup>
import { computed, reactive, ref } from 'vue'
import { getSession } from '../../services/auth.api'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import { createPrescription } from '../../services/therapy.api'
import PageHeader from '../../components/ui/PageHeader.vue'
import SurfaceCard from '../../components/ui/SurfaceCard.vue'
import EmptyState from '../../components/ui/EmptyState.vue'

const token = getSession()?.token
const busy = ref(false)
const notice = ref('')
const error = ref('')
const showPrescriptionModal = ref(false)
const prescriptionForm = reactive({
  patientId: '',
  movementId: '',
  targetRepetisi: 10,
  frekuensiPerHari: 2,
  tanggalMulai: new Date().toISOString().slice(0, 10),
  tanggalBerakhir: '',
})
const sortedPrescriptions = computed(() =>
  [...monitoringData.prescriptions].sort(
    (a, b) => new Date(b.createdAt || b.tanggalMulai) - new Date(a.createdAt || a.tanggalMulai),
  ),
)

function openPrescriptionModal() {
  error.value = ''
  showPrescriptionModal.value = true
}

function closePrescriptionModal() {
  if (busy.value) return
  showPrescriptionModal.value = false
}

async function assignMovementToPatient() {
  error.value = notice.value = ''
  if (!prescriptionForm.patientId || !prescriptionForm.movementId || !prescriptionForm.tanggalBerakhir) {
    error.value = 'Pilih pasien dan gerakan, lalu tentukan tanggal berakhir.'
    return
  }

  busy.value = true
  try {
    await createPrescription({
      patientId: prescriptionForm.patientId,
      movementId: prescriptionForm.movementId,
      targetRepetisi: Number(prescriptionForm.targetRepetisi),
      frekuensiPerHari: Number(prescriptionForm.frekuensiPerHari),
      tanggalMulai: new Date(`${prescriptionForm.tanggalMulai}T00:00:00`).toISOString(),
      tanggalBerakhir: new Date(`${prescriptionForm.tanggalBerakhir}T23:59:59`).toISOString(),
    }, token)
    notice.value = 'Gerakan berhasil ditugaskan kepada pasien.'
    await refreshMonitoringData(token)
    showPrescriptionModal.value = false
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Program pasien"
      title="Tugaskan terapi"
      description="Hubungkan gerakan dari pustaka dengan pasien dan tentukan target terapinya."
    >
      <template #actions>
        <div class="flex items-center gap-2">
          <span class="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-3 text-sm text-muted">
            {{ sortedPrescriptions.length }} resep
          </span>
          <button class="min-h-11 rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark" type="button" @click="openPrescriptionModal">
            Hubungkan ke pasien
          </button>
        </div>
      </template>
    </PageHeader>

    <p v-if="notice" class="rounded-panel border border-success/25 bg-success/5 p-3 text-sm text-success" role="status">{{ notice }}</p>

    <SurfaceCard>
      <header class="mb-3 flex items-center justify-between gap-3">
        <div>
          <p class="mb-1 text-xs font-medium text-primary">Perawatan pasien</p>
          <h2 class="text-lg font-semibold text-primary-dark">Terapi yang ditugaskan</h2>
        </div>
        <span class="text-sm text-muted">{{ sortedPrescriptions.length }} resep</span>
      </header>
      <EmptyState
        v-if="!sortedPrescriptions.length"
        title="Belum ada terapi yang ditugaskan"
        description="Program terapi yang dihubungkan ke pasien akan muncul di sini."
      />
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr class="border-b border-line text-xs font-medium text-muted">
              <th class="px-3 py-3">Pasien</th>
              <th class="px-3 py-3">Gerakan</th>
              <th class="px-3 py-3">Target</th>
              <th class="px-3 py-3">Frekuensi</th>
              <th class="px-3 py-3">Periode terapi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line/70">
            <tr v-for="plan in sortedPrescriptions" :key="plan.id" class="text-sm text-ink hover:bg-base/50">
              <td class="whitespace-nowrap px-3 py-3 font-medium text-primary-dark">
                {{ monitoringData.patients.find((patient) => patient.id === plan.patientId)?.namaLengkap || `Pasien ${plan.patientId.slice(0, 8)}` }}
              </td>
              <td class="px-3 py-3">{{ plan.movement?.namaGerakan || 'Gerakan terapi' }}</td>
              <td class="whitespace-nowrap px-3 py-3">{{ plan.targetRepetisi }} repetisi</td>
              <td class="whitespace-nowrap px-3 py-3">{{ plan.frekuensiPerHari }}× sehari</td>
              <td class="whitespace-nowrap px-3 py-3">
                {{ new Date(plan.tanggalMulai).toLocaleDateString('id-ID') }} – {{ new Date(plan.tanggalBerakhir).toLocaleDateString('id-ID') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SurfaceCard>

    <div v-if="showPrescriptionModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" @click.self="closePrescriptionModal">
      <section aria-labelledby="prescription-modal-title" aria-modal="true" class="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-card border border-line bg-surface p-5 shadow-[var(--connect-shadow-card)] sm:p-6" role="dialog">
        <header class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="prescription-modal-title" class="text-lg font-semibold text-primary-dark">Hubungkan gerakan ke pasien</h2>
            <p class="mt-1 text-sm text-muted">Pilih pasien, gerakan, dan target program terapi.</p>
          </div>
          <button aria-label="Tutup popup" class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted hover:bg-base hover:text-ink disabled:opacity-50" type="button" :disabled="busy" @click="closePrescriptionModal">×</button>
        </header>
        <p v-if="error" class="mb-4 rounded-panel border border-danger/25 bg-danger/5 p-3 text-sm text-danger" role="alert">{{ error }}</p>
        <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="assignMovementToPatient">
          <label class="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
            Pasien
            <select v-model="prescriptionForm.patientId" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" required>
              <option value="" disabled>Pilih pasien</option>
              <option v-for="patient in monitoringData.patients" :key="patient.id" :value="patient.id">{{ patient.namaLengkap }} · {{ patient.user?.email }}</option>
            </select>
          </label>
          <label class="grid gap-2 text-sm font-medium text-ink sm:col-span-2">
            Jenis gerakan
            <select v-model="prescriptionForm.movementId" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" required>
              <option value="" disabled>Pilih gerakan</option>
              <option v-for="movement in monitoringData.movements" :key="movement.id" :value="movement.id">{{ movement.namaGerakan }}</option>
            </select>
          </label>
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
            Tanggal berakhir
            <input v-model="prescriptionForm.tanggalBerakhir" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="date" :min="prescriptionForm.tanggalMulai" required />
          </label>
          <p v-if="!monitoringData.patients.length || !monitoringData.movements.length" class="text-sm leading-6 text-muted sm:col-span-2">
            Penugasan memerlukan pasien yang terhubung dan setidaknya satu gerakan di pustaka.
          </p>
          <div class="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <button class="min-h-11 rounded-panel border border-line px-4 text-sm font-semibold text-primary-dark hover:bg-base disabled:opacity-50" type="button" :disabled="busy" @click="closePrescriptionModal">Batal</button>
            <button class="min-h-11 rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:bg-disabled" type="submit" :disabled="busy || !monitoringData.patients.length || !monitoringData.movements.length">
              {{ busy ? 'Menyimpan…' : 'Hubungkan ke pasien' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
