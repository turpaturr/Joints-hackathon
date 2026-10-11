<script setup>
import { useRoute } from 'vue-router'
import AuthBrand from '../components/auth/AuthBrand.vue'
import AuthIllustration from '../components/auth/AuthIllustration.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
})

const route = useRoute()
</script>

<template>
  <main class="grid min-h-screen bg-base lg:grid-cols-2">
    <section class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8">
      <div class="w-full max-w-md">
        <RouterLink
          v-if="route.name === 'register'"
          to="/login"
          class="mb-8 inline-flex min-h-11 items-center gap-2 rounded-panel px-3 text-sm font-medium text-muted hover:bg-white hover:text-primary-dark"
        >
          <span aria-hidden="true">←</span> Kembali ke masuk
        </RouterLink>
        <AuthBrand />
        <header class="my-8">
          <h1 class="text-2xl font-semibold leading-8 text-primary-dark">{{ title }}</h1>
          <p class="mt-2 text-sm leading-6 text-muted">{{ description }}</p>
        </header>
        <slot />
        <slot name="footer" />
      </div>
    </section>

    <aside class="relative hidden overflow-hidden bg-primary-dark p-12 text-white lg:flex lg:items-center lg:justify-center">
      <div class="absolute -right-20 -top-20 size-96 rounded-full bg-accent-teal/10 blur-3xl" />
      <AuthIllustration />
      <div class="relative z-10 max-w-md">
        <p class="text-sm font-medium tracking-wide text-accent-teal">Connect · Untuk tenaga kesehatan</p>
        <h2 class="mt-4 text-3xl font-semibold leading-tight">Dampingi progres pasien dengan lebih terarah.</h2>
        <p class="mt-4 text-base leading-7 text-white/80">Pantau aktivitas terapi dan kelola informasi pasien dalam satu ruang kerja.</p>
      </div>
    </aside>
  </main>
</template>
