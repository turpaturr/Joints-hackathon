<script setup>
import { computed, ref } from 'vue'
import { monitoringData } from '../../composables/useMonitoringData'
import EmptyState from '../../components/ui/EmptyState.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import SurfaceCard from '../../components/ui/SurfaceCard.vue'

const patientFilter = ref('')
const filteredSessions = computed(() => {
  return monitoringData.sessions
    .filter((session) => !patientFilter.value || session.patientId === patientFilter.value)
    .sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt))
})
const averageAngle = computed(() => {
  if (!filteredSessions.value.length) return '—'
  return `${Math.round(filteredSessions.value.reduce((sum, session) => sum + session.estimatedAngle, 0) / filteredSessions.value.length)}°`
})
const averageReps = computed(() => {
  if (!filteredSessions.value.length) return '—'
  return Math.round(filteredSessions.value.reduce((sum, session) => sum + session.validRepetitions, 0) / filteredSessions.value.length)
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Riwayat terapi" title="Sesi terapi" description="Tinjau sesi latihan yang dikirim melalui aplikasi pasien.">
      <template #actions>
        <label class="grid min-h-11 w-full gap-1 text-xs font-medium text-muted sm:w-64">
          Pasien
          <select v-model="patientFilter" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15">
            <option value="">Semua pasien</option>
            <option v-for="patient in monitoringData.patients" :key="patient.id" :value="patient.id">{{ patient.namaLengkap }}</option>
          </select>
        </label>
      </template>
    </PageHeader>

    <section class="grid gap-4 sm:grid-cols-3" aria-label="Ringkasan sesi terapi">
      <article class="rounded-card border border-line bg-surface p-4 shadow-[var(--connect-shadow-card)] sm:p-5">
        <p class="text-sm text-muted">Catatan sesi</p>
        <strong class="mt-2 block text-2xl font-semibold text-primary-dark">{{ filteredSessions.length }}</strong>
        <small class="mt-1 block text-xs text-muted">Sesi yang diterima</small>
      </article>
      <article class="rounded-card border border-line bg-surface p-4 shadow-[var(--connect-shadow-card)] sm:p-5">
        <p class="text-sm text-muted">Rata-rata repetisi valid</p>
        <strong class="mt-2 block text-2xl font-semibold text-primary-dark">{{ averageReps }}</strong>
        <small class="mt-1 block text-xs text-muted">Dari sesi yang dipilih</small>
      </article>
      <article class="rounded-card border border-line bg-surface p-4 shadow-[var(--connect-shadow-card)] sm:p-5">
        <p class="text-sm text-muted">Estimasi sudut rata-rata</p>
        <strong class="mt-2 block text-2xl font-semibold text-primary-dark">{{ averageAngle }}</strong>
        <small class="mt-1 block text-xs text-muted">Estimasi gerak dari data sesi</small>
      </article>
    </section>

    <SurfaceCard>
      <header class="mb-4 flex items-center justify-between gap-3">
        <div>
          <p class="mb-1 text-xs font-medium text-primary">Riwayat pasien</p>
          <h2 class="text-lg font-semibold text-primary-dark">Sesi latihan pasien</h2>
        </div>
        <span class="text-sm text-muted">{{ filteredSessions.length }} sesi</span>
      </header>

      <EmptyState
        v-if="!filteredSessions.length"
        title="Belum ada sesi terapi"
        description="Riwayat sesi akan muncul setelah aplikasi pasien mengirimkan catatan terapi."
      />
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr class="border-b border-line text-xs font-medium text-muted">
              <th class="px-3 py-3">Pasien</th>
              <th class="px-3 py-3">Program</th>
              <th class="px-3 py-3">Repetisi valid</th>
              <th class="px-3 py-3">Estimasi sudut</th>
              <th class="px-3 py-3">Durasi</th>
              <th class="px-3 py-3">Waktu tercatat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in filteredSessions" :key="session.id" class="border-b border-line/70 text-sm last:border-0">
              <td class="px-3 py-3 font-medium text-ink">{{ monitoringData.patients.find((patient) => patient.id === session.patientId)?.namaLengkap || 'Pasien' }}</td>
              <td class="px-3 py-3 text-ink">{{ session.programName }}</td>
              <td class="px-3 py-3 text-ink">{{ session.validRepetitions }}</td>
              <td class="px-3 py-3 text-ink">{{ session.estimatedAngle }}°</td>
              <td class="px-3 py-3 text-ink">{{ (session.durationMs / 1000).toFixed(1) }} detik</td>
              <td class="px-3 py-3 text-muted">{{ new Date(session.performedAt).toLocaleString('id-ID') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="filteredSessions.length" class="mt-3 border-t border-line pt-3 text-xs leading-5 text-muted">Sudut merupakan estimasi pergerakan dari sensor perangkat, bukan pengukuran medis resmi.</p>
    </SurfaceCard>
  </div>
</template>
