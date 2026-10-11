<script setup>
import { computed, ref } from 'vue'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import EmptyState from '../../components/ui/EmptyState.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
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

function formatGender(value) {
  const normalized = value?.trim().toUpperCase()
  if (normalized === 'LAKI_LAKI') return 'Pria'
  if (normalized === 'PEREMPUAN') return 'Wanita'
  return value || 'Tidak tersedia'
}

function openAddPatientModal() {
  connectionCode.value = ''
  connectionError.value = ''
  showAddPatientModal.value = true
}

function closeAddPatientModal() {
  if (connecting.value) return
  showAddPatientModal.value = false
}

function openLongTextModal(title, content, patientName) {
  longTextModal.value = { title, content, patientName }
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
            <input v-model="search" class="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted" type="search" placeholder="Cari nama atau email" aria-label="Cari pasien" />
          </label>
          <button
            class="min-h-11 shrink-0 rounded-control bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            type="button"
            @click="openAddPatientModal"
          >
            Tambah Pasien
          </button>
        </div>
      </template>
    </PageHeader>

    <p v-if="connectionMessage" class="rounded-panel border border-success/20 bg-success/5 px-4 py-3 text-sm text-success" role="status">
      {{ connectionMessage }}
    </p>

    <div
      v-if="showAddPatientModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      @click.self="closeAddPatientModal"
    >
      <section
        aria-labelledby="add-patient-title"
        aria-modal="true"
        class="w-full max-w-md rounded-card border border-line bg-surface p-6 shadow-[var(--connect-shadow-card)]"
        role="dialog"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 id="add-patient-title" class="text-lg font-semibold text-primary-dark">Tambah Pasien</h2>
            <p class="mt-1 text-sm leading-6 text-muted">Masukkan kode 6 digit yang ditampilkan di aplikasi pasien. Kode berlaku selama 10 menit.</p>
          </div>
          <button
            aria-label="Tutup popup"
            class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted transition hover:bg-base hover:text-ink disabled:opacity-50"
            type="button"
            :disabled="connecting"
            @click="closeAddPatientModal"
          >
            ×
          </button>
        </div>

        <form class="mt-5 space-y-4" @submit.prevent="connectPatient">
          <div>
            <label class="mb-2 block text-sm font-medium text-primary-dark" for="patient-connection-code">Kode pasien</label>
            <input
              id="patient-connection-code"
              v-model="connectionCode"
              class="min-h-12 w-full rounded-control border border-line bg-surface px-3 text-center font-mono text-xl tracking-[0.3em] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              pattern="[0-9]{6}"
              placeholder="000000"
              aria-describedby="connection-code-hint"
              :disabled="connecting"
              @input="connectionCode = $event.target.value.replace(/\D/g, '').slice(0, 6)"
            >
            <span id="connection-code-hint" class="sr-only">Masukkan enam angka dari aplikasi pasien.</span>
            <p v-if="connectionError" class="mt-2 text-sm text-danger" role="alert">{{ connectionError }}</p>
          </div>
          <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              class="min-h-11 rounded-control border border-line px-5 text-sm font-semibold text-primary-dark transition hover:bg-base disabled:opacity-50"
              type="button"
              :disabled="connecting"
              @click="closeAddPatientModal"
            >
              Batal
            </button>
            <button
              class="min-h-11 rounded-control bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
              type="submit"
              :disabled="connecting"
            >
              {{ connecting ? 'Menghubungkan…' : 'Hubungkan' }}
            </button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="monitoringData.loading && !monitoringData.patients.length" class="flex min-h-48 items-center justify-center gap-3 rounded-card border border-line bg-surface text-sm text-muted" role="status">
      <span class="size-5 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" aria-hidden="true" />
      Memuat data pasien…
    </div>
    <EmptyState
      v-else-if="!filteredPatients.length"
      :title="search ? 'Pasien tidak ditemukan' : 'Belum ada pasien'"
      :description="search ? 'Coba kata kunci nama atau email lainnya.' : 'Profil pasien akan muncul setelah ditautkan ke akun Nakes Anda.'"
    />

    <section v-else class="overflow-hidden rounded-card border border-line bg-surface shadow-[var(--connect-shadow-card)]" aria-label="Daftar pasien">
      <header class="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <h2 class="text-sm font-semibold text-primary-dark">Daftar pasien</h2>
        <span class="rounded-full bg-base px-2.5 py-1 text-xs text-muted">{{ filteredPatients.length }} pasien</span>
      </header>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[1440px] border-collapse text-left">
          <thead class="bg-base/70">
            <tr class="text-xs font-medium text-muted">
              <th class="px-5 py-4">Nama pasien</th>
              <th class="px-5 py-4">Email</th>
              <th class="px-5 py-4">Kondisi</th>
              <th class="px-5 py-4">Nomor telepon</th>
              <th class="px-5 py-4">Tanggal lahir</th>
              <th class="px-5 py-4">Jenis kelamin</th>
              <th class="px-5 py-4">Catatan awal</th>
              <th class="px-5 py-4">Alamat</th>
              <th class="px-5 py-4 text-center">Sesi terapi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line/70">
            <tr v-for="patient in filteredPatients" :key="patient.id" class="align-top text-sm text-ink transition hover:bg-base/40">
              <td class="whitespace-nowrap px-5 py-4 font-medium text-primary-dark">{{ patient.namaLengkap || 'Tidak tersedia' }}</td>
              <td class="px-5 py-4">{{ patient.user?.email || 'Tidak tersedia' }}</td>
              <td class="max-w-60 px-5 py-4">
                <button
                  v-if="patient.kondisiMedis"
                  class="block max-w-56 truncate text-left text-primary hover:underline"
                  type="button"
                  @click="openLongTextModal('Kondisi', patient.kondisiMedis, patient.namaLengkap)"
                >
                  {{ patient.kondisiMedis }}
                </button>
                <span v-else>Belum dicantumkan</span>
              </td>
              <td class="whitespace-nowrap px-5 py-4">{{ patient.nomorTelepon || 'Tidak tersedia' }}</td>
              <td class="whitespace-nowrap px-5 py-4">{{ patient.tanggalLahir ? new Date(patient.tanggalLahir).toLocaleDateString('id-ID') : 'Tidak tersedia' }}</td>
              <td class="whitespace-nowrap px-5 py-4">{{ formatGender(patient.jenisKelamin) }}</td>
              <td class="max-w-72 px-5 py-4">
                <button
                  v-if="patient.catatanAwal"
                  class="block max-w-64 truncate text-left text-primary hover:underline"
                  type="button"
                  @click="openLongTextModal('Catatan awal', patient.catatanAwal, patient.namaLengkap)"
                >
                  {{ patient.catatanAwal }}
                </button>
                <span v-else>Belum ada catatan awal.</span>
              </td>
              <td class="max-w-72 px-5 py-4">
                <button
                  v-if="patient.alamat"
                  class="block max-w-64 truncate text-left text-primary hover:underline"
                  type="button"
                  @click="openLongTextModal('Alamat', patient.alamat, patient.namaLengkap)"
                >
                  {{ patient.alamat }}
                </button>
                <span v-else>Tidak tersedia</span>
              </td>
              <td class="px-5 py-4 text-center">{{ patient._count?.therapySessions ?? 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div
      v-if="longTextModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      @click.self="longTextModal = null"
    >
      <section
        aria-labelledby="long-text-title"
        aria-modal="true"
        class="w-full max-w-lg rounded-card border border-line bg-surface p-5 shadow-[var(--connect-shadow-card)]"
        role="dialog"
      >
        <header class="flex items-start justify-between gap-4 border-b border-line pb-3">
          <div class="min-w-0">
            <p class="text-xs text-muted">{{ longTextModal.patientName }}</p>
            <h2 id="long-text-title" class="mt-1 text-base font-semibold text-primary-dark">{{ longTextModal.title }}</h2>
          </div>
          <button
            aria-label="Tutup informasi"
            class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted transition hover:bg-base hover:text-ink"
            type="button"
            @click="longTextModal = null"
          >
            ×
          </button>
        </header>
        <p class="mt-4 max-h-[60vh] overflow-y-auto whitespace-pre-line break-words text-sm leading-6 text-ink">
          {{ longTextModal.content }}
        </p>
      </section>
    </div>
  </div>
</template>
