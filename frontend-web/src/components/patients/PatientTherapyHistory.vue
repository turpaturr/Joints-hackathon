<script setup>
import { ref } from 'vue'
import { demoSessions } from '../../data/patient-detail-demo'

const selectedVideo = ref(null)

function formatDate(value, options = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(value))
}

function formatTime(value) {
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

function formatDuration(durationMs) {
  const totalSeconds = Math.floor(durationMs / 1000)
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`
}
</script>

<template>
  <section id="therapy-history" class="rounded-card border border-line bg-surface p-4 shadow-(--connect-shadow-card) sm:p-5">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Aktivitas pasien</p>
        <h2 class="mt-1 text-xl font-semibold text-primary-dark">Riwayat terapi</h2>
        <p class="mt-1 text-base text-muted">Catatan sesi dan bukti video dari pasien</p>
      </div>
      <span class="text-sm text-muted">{{ demoSessions.length }} sesi · data demo</span>
    </header>
    <div class="mt-4 divide-y divide-line">
      <article v-for="session in demoSessions" :key="session.id" class="grid gap-3 py-4 first:pt-0 sm:grid-cols-[minmax(0,1fr)_100px_128px] sm:items-center">
        <div class="flex min-w-0 items-start gap-3">
          <span class="grid size-12 shrink-0 content-center justify-items-center rounded-control border border-line bg-base text-sm text-muted">
            <span class="uppercase">{{ formatDate(session.performedAt, { weekday: 'short' }) }}</span>
            <strong class="text-base text-primary-dark">{{ formatDate(session.performedAt, { day: 'numeric' }) }}</strong>
          </span>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-base font-semibold text-primary-dark">{{ session.programName }}</h3>
              <span class="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"><i class="size-1 rounded-full bg-success" /> Selesai</span>
            </div>
            <p class="mt-1 text-sm text-muted">{{ formatTime(session.performedAt) }} · {{ formatDuration(session.durationMs) }} · {{ session.validRepetitions }} repetisi</p>
            <p class="mt-2 text-sm leading-6 text-muted">“{{ session.note }}”</p>
          </div>
        </div>
        <div class="flex items-center gap-2 sm:grid sm:justify-items-center sm:gap-0">
          <strong class="text-base font-semibold text-success">{{ session.accuracy }}%</strong>
          <span class="text-sm text-muted">Akurasi gerakan · demo</span>
        </div>
        <button
          class="video-placeholder group relative flex min-h-16 items-center justify-center overflow-hidden rounded-control border border-line text-white transition hover:brightness-105"
          type="button"
          :aria-label="`Lihat placeholder video terapi ${session.programName}`"
          @click="selectedVideo = session"
        >
          <span class="video-shape" />
          <span class="relative grid size-8 place-items-center rounded-full border border-white/70 bg-primary-dark/30 pl-0.5 text-xs transition group-hover:scale-110">▶</span>
          <span class="absolute bottom-1.5 left-2 text-[10px] font-semibold tracking-wider">VIDEO PLACEHOLDER</span>
        </button>
      </article>
    </div>
    <button class="mt-2 flex min-h-11 w-full items-center justify-center gap-2 border-t border-line pt-2 text-sm font-semibold text-primary transition hover:text-primary-dark" type="button">
      Muat riwayat sebelumnya <span aria-hidden="true">↓</span>
    </button>

    <div v-if="selectedVideo" class="fixed inset-0 z-[60] grid place-items-center bg-ink/55 p-4 backdrop-blur-sm" role="presentation" @click.self="selectedVideo = null" @keydown.esc="selectedVideo = null">
      <section class="w-full max-w-xl overflow-hidden rounded-card border border-line bg-surface shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="video-title">
        <div class="video-modal-screen relative grid min-h-56 place-items-center gap-2 px-5 py-10 text-center text-white sm:min-h-72">
          <button class="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25" type="button" aria-label="Tutup video" @click="selectedVideo = null">×</button>
          <span class="grid size-12 place-items-center rounded-full border border-white/50 bg-white/10 text-sm">▶</span>
          <strong class="text-base">Video belum tersedia</strong>
          <span class="text-xs text-white/70">Placeholder · video akan muncul setelah pasien mengunggahnya</span>
        </div>
        <div class="p-5">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted">Bukti terapi pasien · demo</p>
          <h2 id="video-title" class="mt-1 text-xl font-semibold text-primary-dark">{{ selectedVideo.programName }}</h2>
          <p class="mt-1 text-sm text-muted">{{ formatDate(selectedVideo.performedAt) }} · {{ formatTime(selectedVideo.performedAt) }} lokal</p>
          <div class="mt-4 rounded-control bg-base p-3">
            <p class="text-sm font-semibold text-primary-dark">Catatan demo</p>
            <p class="mt-1 text-base leading-6 text-muted">{{ selectedVideo.note }}</p>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.video-placeholder {
  background: linear-gradient(140deg, #cad7e6, #91a7c1 55%, #e0e9f2);
}

.video-shape {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(0deg, rgb(7 65 115 / 45%), transparent 66%),
    radial-gradient(circle at 24% 15%, rgb(255 255 255 / 30%), transparent 32%);
}

.video-modal-screen {
  background: radial-gradient(ellipse at 50% 120%, #276287, #074173 76%);
}
</style>
