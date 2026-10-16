<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  name: { type: String, required: true },
  initials: { type: String, required: true },
  patientId: { type: String, required: true },
  age: { type: Number, default: null },
  gender: { type: String, required: true },
})
</script>

<template>
  <section class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <RouterLink
        class="mb-4 inline-flex min-h-9 items-center gap-2 text-base font-medium text-muted transition hover:text-primary"
        :to="{ name: 'monitoring-patients' }"
      ><span aria-hidden="true">←</span> Kembali ke daftar pasien</RouterLink>
      <div class="flex items-center gap-4">
        <span class="grid size-16 shrink-0 place-items-center rounded-card bg-primary/10 text-xl font-semibold text-primary-dark">{{ initials }}</span>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-2xl font-semibold tracking-tight text-primary-dark sm:text-3xl">{{ name }}</h2>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
              <span class="size-1.5 rounded-full bg-success" /> Aktif
            </span>
          </div>
          <p class="mt-1 text-base text-muted">{{ patientId }} <span class="px-1 text-line">·</span> {{ age ? `${age} tahun` : 'Usia tidak tersedia' }} <span class="px-1 text-line">·</span> {{ gender }}</p>
        </div>
      </div>
    </div>
    <a class="inline-flex min-h-12 items-center gap-2 rounded-control border border-line bg-surface px-4 text-base font-semibold text-primary-dark transition hover:border-primary/40 hover:bg-white" href="#therapy-history">
      <span aria-hidden="true">◷</span> Lihat riwayat terapi
    </a>
  </section>
</template>
