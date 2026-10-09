<template>
  <Teleport to="body">
    <div class="page">
      <LandingNav @home="hero?.scrollToStart()" />
      <HeroStage ref="hero" :image-src="heroSrc" />
      <TrailStage />
      <LandingFooter />
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import LandingNav from '../components/landing/LandingNav.vue'
import HeroStage from '../components/landing/HeroStage.vue'
import TrailStage from '../components/landing/TrailStage.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'

const heroSrc = new URL('../assets/images/gambar-landing.jpg', import.meta.url).href
const hero = ref(null)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap');
:root { color-scheme: light; }
html { -webkit-text-size-adjust: 100%; background: #F7EEDD !important; }
body { display: block !important; place-items: normal !important; margin: 0 !important; min-width: 0 !important; overflow-x: clip; background: #F7EEDD !important; color: #06344F !important; }
#app { max-width: none !important; margin: 0 !important; padding: 0 !important; text-align: left !important; }

/* Unscoped on purpose: scoped styles don't reach elements inside child components */
.page * { box-sizing: border-box; }
.page :where(h1, h2, h3, p, ul, li) { margin: 0; padding: 0; }
</style>

<style scoped>
.page { width: 100%; font-family: 'Open Sans', system-ui, sans-serif; color: #06344F; background: #F7EEDD; text-align: left; }
</style>