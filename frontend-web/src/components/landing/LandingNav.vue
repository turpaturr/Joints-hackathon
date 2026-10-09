<template>
  <nav class="nav">
    <a href="#stage1" class="logo" @click.prevent="emit('home')">connect</a>
  </nav>
</template>

<script setup>
const emit = defineEmits(['home'])
</script>

<style scoped>
.nav { position: fixed; top: 0; left: 0; width: 100%; z-index: 50; display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; pointer-events: none; }
.nav > * { pointer-events: auto; background: rgba(247,238,221,.9); color: #06344F; padding: .45rem .95rem; border-radius: 999px; backdrop-filter: blur(6px); }
.logo { text-decoration: none; font-size: 1.25rem; color: inherit; cursor: pointer; }
</style>