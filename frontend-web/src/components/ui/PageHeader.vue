<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <header class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div>
      <p v-if="eyebrow" class="mb-1 text-xs font-medium text-primary">{{ eyebrow }}</p>
      <h2 class="text-2xl font-semibold leading-8 text-primary-dark">{{ title }}</h2>
      <p v-if="description" class="mt-1 max-w-2xl text-sm leading-6 text-muted">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
