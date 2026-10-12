<script setup>
import { demoMovements } from '../../data/patient-detail-demo'
</script>

<template>
  <section class="rounded-card border border-line bg-surface p-4 shadow-(--connect-shadow-card) sm:p-5">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Rencana perawatan</p>
        <h2 class="mt-1 text-xl font-semibold text-primary-dark">Gerakan terapi</h2>
        <p class="mt-1 text-base text-muted">Gerakan yang diresepkan untuk pasien ini</p>
      </div>
      <span class="text-sm text-muted">{{ demoMovements.length }} gerakan aktif · data demo</span>
    </header>
    <div class="mt-4 grid gap-3 md:grid-cols-2">
      <article v-for="(movement, index) in demoMovements" :key="movement.name" class="rounded-panel border border-line bg-base/40 p-4">
        <div class="flex items-center gap-3">
          <span class="grid size-10 place-items-center rounded-control" :class="index ? 'bg-[#f1edfa] text-[#8060bd]' : 'bg-primary/10 text-primary'">
            <svg viewBox="0 0 32 32" class="size-6" fill="none" aria-hidden="true">
              <circle cx="16" cy="6" r="2.5" fill="currentColor" />
              <path d="M16 10v7m0-4-6 4m6-4 6 3m-6 1-5 9m5-9 6 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div class="min-w-0 flex-1">
            <span class="text-xs text-muted">{{ movement.category }}</span>
            <h3 class="text-base font-semibold text-primary-dark">{{ movement.name }}</h3>
          </div>
          <span class="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-muted">{{ movement.target }}</span>
        </div>
        <p class="mt-3 min-h-10 text-sm leading-6 text-muted">{{ movement.instruction }}</p>
        <div class="mt-3 flex items-center justify-between text-sm">
          <span class="text-muted">Kepatuhan minggu ini · demo</span><strong class="text-primary-dark">{{ movement.progress }}%</strong>
        </div>
        <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white"><span class="block h-full rounded-full bg-primary" :style="{ width: `${movement.progress}%` }" /></div>
      </article>
    </div>
  </section>
</template>
