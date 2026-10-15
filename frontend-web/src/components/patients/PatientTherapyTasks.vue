<script setup>
import { demoTasks } from '../../data/patient-detail-demo'
</script>

<template>
  <aside class="rounded-card border border-line bg-surface p-4 shadow-(--connect-shadow-card) sm:p-5">
    <header class="flex items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Program aktif</p>
        <h2 class="mt-1 text-xl font-semibold text-primary-dark">Tugas terapi</h2>
      </div>
      <span class="rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">Aktif</span>
    </header>
    <div class="mt-4 flex items-center gap-3 border-b border-line pb-4">
      <span class="grid size-9 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary-dark">AP</span>
      <div class="min-w-0">
        <p class="text-sm text-muted">Diresepkan oleh</p>
        <p class="truncate text-base font-semibold text-primary-dark">dr. Aditya Pratama</p>
      </div>
      <span class="ml-auto text-xs text-muted">12 Okt 2026</span>
    </div>
    <ul class="divide-y divide-line">
      <li v-for="(task, index) in demoTasks" :key="task.name" class="flex items-center gap-3 py-4">
        <span class="grid size-6 shrink-0 place-items-center rounded-md border text-xs font-bold" :class="task.complete ? 'border-success/30 bg-success/10 text-success' : 'border-line text-muted'">
          {{ task.complete ? '✓' : index + 1 }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-ink">{{ task.name }}</p>
          <p class="mt-0.5 text-xs text-muted">{{ task.detail }}</p>
        </div>
        <span class="shrink-0 text-xs text-muted">{{ task.frequency }}</span>
      </li>
    </ul>
    <div class="mt-1 border-t border-line pt-4">
      <div class="flex items-center justify-between gap-2 text-sm">
        <span class="text-muted">Progres minggu ini</span><strong class="text-primary-dark">7 dari 10 sesi</strong>
      </div>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-base"><span class="block h-full w-[70%] rounded-full bg-primary" /></div>
      <p class="mt-2 text-xs text-muted">3 sesi lagi untuk mencapai target</p>
    </div>
  </aside>
</template>
