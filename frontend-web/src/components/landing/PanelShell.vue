<template>
  <article class="panel" :class="variant">
    <h2>{{ title }}</h2>
    <slot />
  </article>
</template>

<script setup>
// variant: 'cream' | 'mint' | 'sky' | 'blue'
defineProps({
  title: { type: String, required: true },
  variant: { type: String, default: 'cream' },
})
</script>

<style scoped>
.panel { position: relative; z-index: 2; min-width: 0; min-height: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: center; padding: 6rem 7vw 6rem; }
.panel h2 { color: #0a0a0a; max-width: 40rem; font-size: clamp(1.7rem, min(5vw, 8svh), 4.5rem); line-height: 1.05; letter-spacing: -.02em; font-weight: 800; }

/* --panel-accent is read by PanelItems for its h3 color */
.cream { background: #F7EEDD; --panel-accent: #008DDA; }
.mint { background: #ACE2E1; }
.sky { background: #41C9E2; }
.blue { background: #008DDA; color: #F7EEDD; --panel-accent: #ACE2E1; }
.blue h2 { color: #F7EEDD; }

@media (max-width: 768px) {
  .panel { padding: 4.5rem 1.5rem 2.5rem; }
}
@media (max-height: 700px) {
  .panel { padding-top: 4rem; padding-bottom: 1.5rem; }
}
@media (max-height: 560px) and (orientation: landscape), (max-width: 900px) and (orientation: landscape) {
  .panel h2 { font-size: clamp(1.3rem, 7svh, 2rem); }
}
</style>