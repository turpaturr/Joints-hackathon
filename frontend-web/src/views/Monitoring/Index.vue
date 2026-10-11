<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import { getSession } from '../../services/auth.api'
import EmptyState from '../../components/ui/EmptyState.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import SurfaceCard from '../../components/ui/SurfaceCard.vue'

const router = useRouter()
const token = getSession()?.token
const todaySessions = computed(() => {
  const today = new Date().toDateString()
  return monitoringData.sessions.filter((item) => new Date(item.performedAt).toDateString() === today).length
})
const cards = computed(() => [
  { label: 'Pasien dalam pemantauan', value: monitoringData.patients.length, detail: 'Pasien yang ditugaskan kepada Anda', tone: 'bg-primary/10 text-primary' },
  { label: 'Gerakan terapi', value: monitoringData.movements.length, detail: 'Gerakan yang tersedia', tone: 'bg-accent-teal/20 text-primary-dark' },
  { label: 'Resep terapi aktif', value: monitoringData.prescriptions.filter((item) => Date.parse(item.tanggalMulai) <= Date.now() && Date.parse(item.tanggalBerakhir) >= Date.now()).length, detail: `${monitoringData.prescriptions.length} resep tersimpan`, tone: 'bg-accent-lime/40 text-primary-dark' },
  { label: 'Sesi terapi hari ini', value: todaySessions.value, detail: 'Sesi yang dikirim pasien', tone: 'bg-success/10 text-success' },
])

function refresh() {
  return refreshMonitoringData(token)
}
</script>

<template>
  <div class="space-y-6">
    <section class="flex flex-col justify-between gap-5 rounded-card border border-line bg-surface p-5 shadow-[var(--connect-shadow-card)] sm:flex-row sm:items-center sm:p-6">
      <div>
        <p class="mb-1 text-xs font-medium text-primary">Dashboard pemantauan</p>
        <h2 class="text-2xl font-semibold leading-8 text-primary-dark">Ringkasan perawatan pasien</h2>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-muted">Pantau pasien, rencana terapi, dan sesi yang tercatat dari aplikasi pasien.</p>
      </div>
      <button
        class="min-h-11 shrink-0 rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:bg-disabled"
        :disabled="monitoringData.loading"
        @click="refresh"
      >
        {{ monitoringData.loading ? 'Memuat…' : 'Muat ulang data' }}
      </button>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan pemantauan">
      <article v-for="card in cards" :key="card.label" class="rounded-card border border-line bg-surface p-4 shadow-[var(--connect-shadow-card)] sm:p-5">
        <span :class="['grid size-9 place-items-center rounded-panel text-sm font-semibold', card.tone]" aria-hidden="true">{{ card.label.slice(0, 1) }}</span>
        <p class="mt-4 text-sm text-muted">{{ card.label }}</p>
        <strong class="mt-1 block text-2xl font-semibold leading-8 text-primary-dark">{{ card.value }}</strong>
        <small class="mt-1 block text-xs leading-5 text-muted">{{ card.detail }}</small>
      </article>
    </section>

    <SurfaceCard>
      <header class="mb-4 flex items-center justify-between gap-3">
        <div>
          <p class="mb-1 text-xs font-medium text-primary">Tim perawatan</p>
          <h2 class="text-lg font-semibold text-primary-dark">Pasien</h2>
        </div>
        <RouterLink class="min-h-11 content-center rounded-panel px-3 text-sm font-medium text-primary hover:bg-base" :to="{ name: 'monitoring-patients' }">Lihat semua →</RouterLink>
      </header>

      <div v-if="monitoringData.loading && !monitoringData.patients.length" class="flex min-h-36 items-center justify-center gap-3 text-sm text-muted" role="status">
        <span class="size-5 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" aria-hidden="true" />
        Memuat data pasien…
      </div>
      <EmptyState
        v-else-if="!monitoringData.patients.length"
        title="Belum ada pasien"
        description="Pasien akan muncul di sini setelah profil mereka ditautkan ke akun Nakes Anda."
      />
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[620px] border-collapse text-left">
          <thead>
            <tr class="border-b border-line text-xs font-medium text-muted">
              <th class="px-3 py-3">Pasien</th>
              <th class="px-3 py-3">Kondisi</th>
              <th class="px-3 py-3">Sesi tercatat</th>
              <th class="px-3 py-3"><span class="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="patient in monitoringData.patients.slice(0, 5)"
              :key="patient.id"
              class="border-b border-line/70 text-sm last:border-0 hover:bg-base/70"
            >
              <td class="px-3 py-3">
                <button class="flex min-h-11 items-center gap-3 text-left" @click="router.push({ name: 'monitoring-patients', query: { patient: patient.id } })">
                  <span class="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary">{{ patient.namaLengkap?.slice(0, 1) || 'P' }}</span>
                  <span class="grid min-w-0">
                    <strong class="truncate font-medium text-ink">{{ patient.namaLengkap }}</strong>
                    <small class="truncate text-xs text-muted">{{ patient.user?.email || 'Email tidak tersedia' }}</small>
                  </span>
                </button>
              </td>
              <td class="px-3 py-3 text-muted">{{ patient.kondisiMedis || 'Belum dicantumkan' }}</td>
              <td class="px-3 py-3 text-ink">{{ patient._count?.therapySessions ?? 0 }}</td>
              <td class="px-3 py-3 text-right">
                <button class="min-h-11 rounded-panel px-3 text-sm font-medium text-primary hover:bg-primary/5" @click="router.push({ name: 'monitoring-patients', query: { patient: patient.id } })">Lihat detail</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SurfaceCard>

    <div class="grid gap-4 xl:grid-cols-2">
      <SurfaceCard>
        <header class="mb-3 flex items-center justify-between gap-3">
          <div>
            <p class="mb-1 text-xs font-medium text-primary">Aktivitas terbaru</p>
            <h2 class="text-lg font-semibold text-primary-dark">Sesi terapi</h2>
          </div>
          <RouterLink class="min-h-11 content-center rounded-panel px-3 text-sm font-medium text-primary hover:bg-base" :to="{ name: 'monitoring-reports' }">Riwayat sesi →</RouterLink>
        </header>
        <div v-if="monitoringData.sessions.length" class="divide-y divide-line/70">
          <div v-for="item in monitoringData.sessions.slice(0, 4)" :key="item.id" class="flex min-h-14 items-center gap-3 py-2">
            <span class="grid size-9 shrink-0 place-items-center rounded-panel bg-primary/10 font-semibold text-primary" aria-hidden="true">↗</span>
            <div class="grid min-w-0 flex-1">
              <strong class="truncate text-sm font-medium text-ink">{{ item.programName }}</strong>
              <small class="text-xs text-muted">{{ new Date(item.performedAt).toLocaleString('id-ID') }}</small>
            </div>
            <span class="shrink-0 text-sm text-muted">{{ item.validRepetitions }} repetisi</span>
          </div>
        </div>
        <EmptyState v-else title="Belum ada sesi terapi" description="Riwayat sesi muncul setelah aplikasi pasien mengirimkan catatan terapi." />
      </SurfaceCard>

      <SurfaceCard>
        <header class="mb-3 flex items-center justify-between gap-3">
          <div>
            <p class="mb-1 text-xs font-medium text-primary">Pustaka terapi</p>
            <h2 class="text-lg font-semibold text-primary-dark">Katalog gerakan</h2>
          </div>
          <RouterLink class="min-h-11 content-center rounded-panel px-3 text-sm font-medium text-primary hover:bg-base" :to="{ name: 'monitoring-therapy' }">Kelola →</RouterLink>
        </header>
        <div v-if="monitoringData.movements.length" class="divide-y divide-line/70">
          <div v-for="item in monitoringData.movements.slice(0, 4)" :key="item.id" class="flex min-h-14 items-center gap-3 py-2">
            <span class="grid size-9 shrink-0 place-items-center rounded-panel bg-accent-teal/20 font-semibold text-primary-dark" aria-hidden="true">✳</span>
            <div class="grid min-w-0">
              <strong class="truncate text-sm font-medium text-ink">{{ item.namaGerakan }}</strong>
              <small class="text-xs text-muted">{{ item.mediaType || 'Gerakan terapi' }}</small>
            </div>
          </div>
        </div>
        <EmptyState v-else title="Belum ada gerakan" description="Data katalog gerakan belum tersedia." />
      </SurfaceCard>
    </div>
  </div>
</template>
