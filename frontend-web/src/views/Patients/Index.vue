<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { monitoringData } from '../../composables/useMonitoringData'
import EmptyState from '../../components/ui/EmptyState.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import SurfaceCard from '../../components/ui/SurfaceCard.vue'

const route = useRoute()
const search = ref('')
const selectedPatientId = ref(route.query.patient || '')
const filteredPatients = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return monitoringData.patients
  return monitoringData.patients.filter((patient) =>
    [patient.namaLengkap, patient.user?.email, patient.kondisiMedis, patient.nomorTelepon]
      .some((value) => value?.toLowerCase().includes(query)),
  )
})
const selectedPatient = computed(() =>
  filteredPatients.value.find((patient) => patient.id === selectedPatientId.value) || filteredPatients.value[0],
)
</script>

<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Tim perawatan" title="Pasien" description="Kelola profil pasien yang berada dalam pemantauan Anda.">
      <template #actions>
        <label class="flex min-h-11 w-full items-center gap-2 rounded-panel border border-line bg-surface px-3 text-muted focus-within:border-primary sm:w-72">
          <span aria-hidden="true" class="text-lg">⌕</span>
          <span class="sr-only">Cari pasien</span>
          <input v-model="search" class="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted" type="search" placeholder="Cari nama atau email" aria-label="Cari pasien" />
        </label>
      </template>
    </PageHeader>

    <div v-if="monitoringData.loading && !monitoringData.patients.length" class="flex min-h-48 items-center justify-center gap-3 rounded-card border border-line bg-surface text-sm text-muted" role="status">
      <span class="size-5 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" aria-hidden="true" />
      Memuat data pasien…
    </div>
    <EmptyState
      v-else-if="!filteredPatients.length"
      :title="search ? 'Pasien tidak ditemukan' : 'Belum ada pasien'"
      :description="search ? 'Coba kata kunci nama atau email lainnya.' : 'Profil pasien akan muncul setelah ditautkan ke akun Nakes Anda.'"
    />

    <div v-else class="grid items-start gap-4 xl:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.5fr)]">
      <section class="grid gap-2" aria-label="Daftar pasien">
        <button
          v-for="patient in filteredPatients"
          :key="patient.id"
          :class="[
            'grid min-h-20 grid-cols-[40px_minmax(0,1fr)_20px] items-center gap-x-3 gap-y-1 rounded-card border bg-surface px-4 py-3 text-left shadow-[var(--connect-shadow-card)] transition hover:border-primary/40 hover:bg-white',
            selectedPatient?.id === patient.id ? 'border-primary/50 ring-1 ring-primary/15' : 'border-line',
          ]"
          :aria-pressed="selectedPatient?.id === patient.id"
          @click="selectedPatientId = patient.id"
        >
          <span class="row-span-2 grid size-10 place-items-center rounded-full bg-primary/10 font-semibold text-primary">{{ patient.namaLengkap?.slice(0, 1) || 'P' }}</span>
          <span class="truncate text-sm font-semibold text-primary-dark">{{ patient.namaLengkap }}</span>
          <span class="text-right text-lg text-muted" aria-hidden="true">›</span>
          <small class="col-start-2 truncate text-xs text-muted">{{ patient.user?.email || 'Email tidak tersedia' }}</small>
          <small class="col-span-2 col-start-2 truncate text-xs text-muted">{{ patient.kondisiMedis || 'Kondisi belum dicantumkan' }}</small>
        </button>
      </section>

      <SurfaceCard v-if="selectedPatient">
        <header class="flex items-center gap-4 border-b border-line pb-5">
          <span class="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 text-lg font-semibold text-primary">{{ selectedPatient.namaLengkap?.slice(0, 1) || 'P' }}</span>
          <div class="min-w-0">
            <p class="mb-1 text-xs font-medium text-primary">Profil pasien</p>
            <h2 class="truncate text-xl font-semibold text-primary-dark">{{ selectedPatient.namaLengkap }}</h2>
            <p class="truncate text-sm text-muted">{{ selectedPatient.user?.email || 'Email tidak tersedia' }}</p>
          </div>
        </header>

        <dl class="grid gap-x-6 gap-y-5 py-5 sm:grid-cols-2">
          <div>
            <dt class="text-xs text-muted">Kondisi</dt>
            <dd class="mt-1 text-sm font-medium leading-6 text-ink">{{ selectedPatient.kondisiMedis || 'Belum dicantumkan' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted">Nomor telepon</dt>
            <dd class="mt-1 text-sm font-medium text-ink">{{ selectedPatient.nomorTelepon || 'Tidak tersedia' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted">Tanggal lahir</dt>
            <dd class="mt-1 text-sm font-medium text-ink">{{ selectedPatient.tanggalLahir ? new Date(selectedPatient.tanggalLahir).toLocaleDateString('id-ID') : 'Tidak tersedia' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted">Jenis kelamin</dt>
            <dd class="mt-1 text-sm font-medium text-ink">{{ selectedPatient.jenisKelamin || 'Tidak tersedia' }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-xs text-muted">Catatan awal</dt>
            <dd class="mt-1 whitespace-pre-line text-sm leading-6 text-ink">{{ selectedPatient.catatanAwal || 'Belum ada catatan awal.' }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-xs text-muted">Alamat</dt>
            <dd class="mt-1 text-sm leading-6 text-ink">{{ selectedPatient.alamat || 'Tidak tersedia' }}</dd>
          </div>
        </dl>

        <footer class="flex flex-wrap items-center justify-between gap-3 rounded-panel bg-base px-4 py-3">
          <span class="text-sm text-muted">Sesi terapi tercatat</span>
          <strong class="text-lg font-semibold text-primary-dark">{{ selectedPatient._count?.therapySessions ?? 0 }}</strong>
        </footer>
      </SurfaceCard>
    </div>
  </div>
</template>
