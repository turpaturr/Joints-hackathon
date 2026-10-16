<script setup>
import { computed, ref } from 'vue'
import { getSession } from '../../services/auth.api'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import {
  createPrescription,
  deletePrescription,
  updatePrescription,
} from '../../services/therapy.api'
import PageHeader from '../../components/ui/PageHeader.vue'
import SurfaceCard from '../../components/ui/SurfaceCard.vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import DeleteConfirmationDialog from '../../components/therapy/DeleteConfirmationDialog.vue'
import PrescriptionFormDialog from '../../components/therapy/PrescriptionFormDialog.vue'
import PrescriptionTable from '../../components/therapy/PrescriptionTable.vue'

const token = getSession()?.token
const busy = ref(false)
const notice = ref('')
const error = ref('')
const showPrescriptionModal = ref(false)
const prescriptionToDelete = ref(null)
const editingPrescription = ref(null)
const sortedPrescriptions = computed(() => [...monitoringData.prescriptions].sort((a, b) => {
  const dateA = new Date(a.createdAt || a.tanggalMulai).getTime()
  const dateB = new Date(b.createdAt || b.tanggalMulai).getTime()
  return (Number.isFinite(dateB) ? dateB : 0) - (Number.isFinite(dateA) ? dateA : 0)
}))

function openPrescriptionModal() {
  error.value = ''
  notice.value = ''
  editingPrescription.value = null
  showPrescriptionModal.value = true
}

function editPrescription(plan) {
  error.value = ''
  notice.value = ''
  editingPrescription.value = plan
  showPrescriptionModal.value = true
}

function closePrescriptionModal() {
  if (busy.value) return
  showPrescriptionModal.value = false
  editingPrescription.value = null
}

async function savePrescription(payload) {
  error.value = notice.value = ''
  busy.value = true
  try {
    if (editingPrescription.value) {
      await updatePrescription(editingPrescription.value.id, payload, token)
      notice.value = 'Resep terapi berhasil diperbarui.'
    } else {
      await createPrescription(payload, token)
      notice.value = 'Gerakan berhasil ditugaskan kepada pasien.'
    }
    await refreshMonitoringData(token)
    showPrescriptionModal.value = false
    editingPrescription.value = null
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    busy.value = false
  }
}

function confirmRemovePrescription(plan) {
  error.value = ''
  prescriptionToDelete.value = plan
}

async function removePrescription() {
  const plan = prescriptionToDelete.value
  if (!plan) return
  error.value = ''
  notice.value = ''
  busy.value = true
  try {
    await deletePrescription(plan.id, token)
    await refreshMonitoringData(token)
    notice.value = 'Resep terapi berhasil dihapus.'
    prescriptionToDelete.value = null
  } catch (requestError) {
    error.value = requestError.message || 'Resep terapi gagal dihapus.'
  } finally {
    busy.value = false
  }
}

function closeDeleteConfirmation() {
  if (busy.value) return
  prescriptionToDelete.value = null
}

const deletingPatientName = computed(() => monitoringData.patients.find(
  (patient) => patient.id === prescriptionToDelete.value?.patientId,
)?.namaLengkap || 'pasien ini')
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
      <PrescriptionTable
        v-else
        :prescriptions="sortedPrescriptions"
        :patients="monitoringData.patients"
        :busy="busy"
        @edit="editPrescription"
        @delete="confirmRemovePrescription"
      />
    </SurfaceCard>

    <PrescriptionFormDialog
      v-if="showPrescriptionModal"
      :patients="monitoringData.patients"
      :movements="monitoringData.movements"
      :prescription="editingPrescription"
      :busy="busy"
      :error="error"
      @close="closePrescriptionModal"
      @submit="savePrescription"
    />

    <DeleteConfirmationDialog
      v-if="prescriptionToDelete"
      title="Hapus resep terapi?"
      :description="`Resep “${prescriptionToDelete.movement?.namaGerakan || 'Gerakan terapi'}” untuk ${deletingPatientName} akan dihapus. Tindakan ini tidak dapat dibatalkan.`"
      confirm-label="Ya, hapus resep"
      :busy="busy"
      :error="error"
      @cancel="closeDeleteConfirmation"
      @confirm="removePrescription"
    />
  </div>
</template>
