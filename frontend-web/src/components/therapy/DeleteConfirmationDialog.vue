<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  confirmLabel: { type: String, required: true },
  busy: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

defineEmits(['cancel', 'confirm'])
</script>

<template>
  <div
    class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
    role="presentation"
    @click.self="$emit('cancel')"
  >
    <section
      class="w-full max-w-md overflow-hidden rounded-card border border-line bg-surface shadow-2xl"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div class="px-6 pb-5 pt-7 text-center">
        <span class="mx-auto grid size-14 place-items-center rounded-full bg-danger/10 text-danger">
          <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2m3 0-1 14H6L5 6" />
            <path d="M10 11v5m4-5v5" />
          </svg>
        </span>
        <p class="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-danger">Konfirmasi penghapusan</p>
        <h2 id="delete-dialog-title" class="mt-1 text-xl font-semibold text-primary-dark">{{ title }}</h2>
        <p id="delete-dialog-description" class="mt-2 text-sm leading-6 text-muted">{{ description }}</p>
        <p v-if="error" class="mt-4 rounded-panel border border-danger/20 bg-danger/5 px-3 py-2 text-left text-sm text-danger" role="alert">
          {{ error }}
        </p>
      </div>
      <footer class="flex flex-col-reverse gap-2 border-t border-line bg-base/60 px-6 py-4 sm:flex-row sm:justify-end">
        <button
          class="min-h-11 rounded-control border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-base disabled:opacity-50"
          type="button"
          :disabled="busy"
          @click="$emit('cancel')"
        >
          Batal
        </button>
        <button
          class="min-h-11 rounded-control bg-danger px-4 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          :disabled="busy"
          @click="$emit('confirm')"
        >
          {{ busy ? 'Menghapus…' : confirmLabel }}
        </button>
      </footer>
    </section>
  </div>
</template>
