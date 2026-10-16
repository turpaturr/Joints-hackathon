<script setup>
defineProps({
  preview: { type: Object, required: true },
})

defineEmits(['close'])
</script>

<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" role="presentation" @click.self="$emit('close')">
    <section
      class="w-full max-w-3xl overflow-hidden rounded-card border border-line bg-surface shadow-[var(--connect-shadow-card)]"
      role="dialog"
      aria-modal="true"
      :aria-label="preview.title"
    >
      <header class="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
        <h2 class="truncate text-base font-semibold text-primary-dark">{{ preview.title }}</h2>
        <button
          class="grid size-9 shrink-0 place-items-center rounded-control text-xl text-muted hover:bg-base hover:text-ink"
          type="button"
          aria-label="Tutup media"
          @click="$emit('close')"
        >
          ×
        </button>
      </header>
      <div class="bg-black p-2 sm:p-4">
        <img
          v-if="preview.type === 'IMAGE'"
          class="mx-auto max-h-[75vh] w-auto max-w-full object-contain"
          :src="preview.src"
          :alt="`Gambar gerakan ${preview.title}`"
        />
        <iframe
          v-else
          class="aspect-video w-full"
          :src="preview.src"
          :title="`Video gerakan ${preview.title}`"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        />
      </div>
    </section>
  </div>
</template>
