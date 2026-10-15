<script setup>
import { computed, ref } from 'vue'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import EmptyState from '../../components/ui/EmptyState.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import PatientConnectionModal from '../../components/patients/PatientConnectionModal.vue'
import PatientTable from '../../components/patients/PatientTable.vue'
import PatientTextModal from '../../components/patients/PatientTextModal.vue'
import { getSession } from '../../services/auth.api'
import { redeemPatientCode } from '../../services/connection.api'

const search = ref('')
const connectionCode = ref('')
const connectionError = ref('')
const connectionMessage = ref('')
const connecting = ref(false)
const showAddPatientModal = ref(false)
const longTextModal = ref(null)
const session = getSession()

const filteredPatients = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return monitoringData.patients
  return monitoringData.patients.filter((patient) =>
    [patient.namaLengkap, patient.user?.email, patient.kondisiMedis, patient.nomorTelepon]
      .some((value) => value?.toLowerCase().includes(query)),
  )
})

function openAddPatientModal() {
  connectionCode.value = ''
  connectionError.value = ''
  showAddPatientModal.value = true
}

function closeAddPatientModal() {
  if (connecting.value) return
  showAddPatientModal.value = false
}

async function connectPatient() {
  const code = connectionCode.value.trim()
  if (!/^\d{6}$/.test(code)) {
    connectionError.value = 'Masukkan kode pasien yang terdiri dari 6 angka.'
    connectionMessage.value = ''
    return
  }
  if (!session?.token) {
    connectionError.value = 'Sesi login tidak ditemukan. Silakan login kembali.'
    connectionMessage.value = ''
    return
  }

  connecting.value = true
  connectionError.value = ''
  connectionMessage.value = ''
  try {
    const response = await redeemPatientCode(code, session.token)
    const patient = response?.data ?? response
    connectionCode.value = ''
    connectionMessage.value = patient?.namaLengkap
      ? `${patient.namaLengkap} berhasil dihubungkan ke daftar pasien Anda.`
      : 'Pasien berhasil dihubungkan ke daftar Anda.'
    await refreshMonitoringData(session.token)
    showAddPatientModal.value = false
  } catch (error) {
    connectionError.value = error?.message || 'Kode pasien gagal diproses. Coba lagi.'
  } finally {
    connecting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Tim perawatan" title="Pasien" description="Kelola profil pasien yang berada dalam pemantauan Anda.">
      <template #actions>
        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <label class="flex min-h-11 w-full items-center gap-2 rounded-panel border border-line bg-surface px-3 text-muted focus-within:border-primary sm:w-72">
            <span aria-hidden="true" class="text-lg">⌕</span>
            <span class="sr-only">Cari pasien</span>
            <input v-model="search" class="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted" type="search" placeholder="Cari nama atau email" aria-label="Cari pasien">
          </label>
          <button class="min-h-11 shrink-0 rounded-control bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark" type="button" @click="openAddPatientModal">
            Tambah Pasien
          </button>
        </div>
      </template>
    </PageHeader>

    <p v-if="connectionMessage" class="rounded-panel border border-success/20 bg-success/5 px-4 py-3 text-sm text-success" role="status">
      {{ connectionMessage }}
    </p>

    <PatientConnectionModal
      :open="showAddPatientModal"
      :code="connectionCode"
      :error="connectionError"
      :connecting="connecting"
      @update:code="connectionCode = $event"
      @close="closeAddPatientModal"
      @submit="connectPatient"
    />

    <div v-if="monitoringData.loading && !monitoringData.patients.length" class="flex min-h-48 items-center justify-center gap-3 rounded-card border border-line bg-surface text-sm text-muted" role="status">
      <span class="size-5 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" aria-hidden="true" />
      Memuat data pasien…
    </div>
    <EmptyState
      v-else-if="!filteredPatients.length"
      :title="search ? 'Pasien tidak ditemukan' : 'Belum ada pasien'"
      :description="search ? 'Coba kata kunci nama atau email lainnya.' : 'Profil pasien akan muncul setelah ditautkan ke akun Nakes Anda.'"
    />
    <PatientTable v-else :patients="filteredPatients" @open-text="longTextModal = $event" />

    <PatientTextModal :modal="longTextModal" @close="longTextModal = null" />
  </div>
</template>
