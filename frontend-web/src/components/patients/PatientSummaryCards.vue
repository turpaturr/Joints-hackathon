<script setup>
defineProps({
  patient: { type: Object, required: true },
  session: { type: Object, required: true },
  formatDate: { type: Function, required: true },
  formatTime: { type: Function, required: true },
})
</script>

<template>
  <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan pasien">
    <article class="flex min-h-28 items-start gap-3 rounded-card border border-line bg-surface p-5 shadow-(--connect-shadow-card)">
      <span class="grid size-11 shrink-0 place-items-center rounded-control bg-primary/10 text-xl text-primary">⌖</span>
      <div class="min-w-0">
        <p class="text-sm text-muted">Kondisi pasien</p>
        <p class="mt-1 truncate text-base font-semibold text-primary-dark">{{ patient.kondisiMedis || 'Belum dicantumkan' }}</p>
        <p class="mt-1 text-sm text-muted">Dalam pemantauan</p>
      </div>
    </article>
    <article class="flex min-h-28 items-start gap-3 rounded-card border border-line bg-surface p-5 shadow-(--connect-shadow-card)">
      <span class="grid size-11 shrink-0 place-items-center rounded-control bg-success/10 text-xl text-success">▦</span>
      <div>
        <p class="text-sm text-muted">Sesi minggu ini</p>
        <p class="mt-1 text-2xl font-semibold text-primary-dark">8 <span class="text-base font-medium text-muted">sesi</span></p>
        <p class="mt-1 text-sm text-success">↑ 2 sesi dari minggu lalu</p>
      </div>
    </article>
    <article class="flex min-h-28 items-start gap-3 rounded-card border border-line bg-surface p-5 shadow-(--connect-shadow-card)">
      <span class="grid size-11 shrink-0 place-items-center rounded-control bg-[#f1edfa] text-xl text-[#8060bd]">％</span>
      <div>
        <p class="text-sm text-muted">Kepatuhan terapi</p>
        <p class="mt-1 text-2xl font-semibold text-primary-dark">87<span class="text-base font-medium text-muted">%</span></p>
        <p class="mt-1 text-sm text-muted">Target mingguan 80%</p>
      </div>
    </article>
    <article class="flex min-h-28 items-start gap-3 rounded-card border border-line bg-surface p-5 shadow-(--connect-shadow-card)">
      <span class="grid size-11 shrink-0 place-items-center rounded-control bg-warning/10 text-xl text-warning">◷</span>
      <div>
        <p class="text-sm text-muted">Sesi terakhir</p>
        <p class="mt-1 text-2xl font-semibold text-primary-dark">{{ formatTime(session.performedAt) }} <span class="text-base font-medium text-muted">lokal</span></p>
        <p class="mt-1 text-sm text-muted">{{ formatDate(session.performedAt) }}</p>
      </div>
    </article>
  </section>
</template>
