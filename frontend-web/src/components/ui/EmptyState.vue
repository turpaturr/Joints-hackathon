<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="grid min-h-40 place-content-center justify-items-center px-4 py-8 text-center">
    <span class="grid size-11 place-items-center rounded-panel bg-base text-primary" aria-hidden="true">
      <slot name="icon">i</slot>
    </span>
    <h3 class="mt-3 text-base font-semibold text-primary-dark">{{ title }}</h3>
    <p v-if="description" class="mt-1 max-w-lg text-sm leading-6 text-muted">{{ description }}</p>
    <slot />
  </div>
</template>
