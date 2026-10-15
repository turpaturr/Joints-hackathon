<script setup>
defineProps({
  modal: { type: Object, default: null },
})

const emit = defineEmits(['close'])
</script>

<template>
  <div
    v-if="modal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="presentation"
    @click.self="emit('close')"
  >
    <section
      aria-labelledby="long-text-title"
      aria-modal="true"
      class="w-full max-w-lg rounded-card border border-line bg-surface p-5 shadow-(--connect-shadow-card)"
      role="dialog"
    >
      <header class="flex items-start justify-between gap-4 border-b border-line pb-3">
        <div class="min-w-0">
          <p class="text-xs text-muted">{{ modal.patientName }}</p>
          <h2 id="long-text-title" class="mt-1 text-[length:1rem] font-semibold text-primary-dark">{{ modal.title }}</h2>
        </div>
        <button
          aria-label="Tutup informasi"
          class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted transition hover:bg-base hover:text-ink"
          type="button"
          @click="emit('close')"
        >×</button>
      </header>
      <p class="mt-4 max-h-[60vh] overflow-y-auto whitespace-pre-line wrap-break-word text-sm leading-6 text-ink">
        {{ modal.content }}
      </p>
    </section>
  </div>
</template>
