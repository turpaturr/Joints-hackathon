<template>
  <div id="imagePanel" ref="panelEl" class="image-panel" @click="active = null" @keydown.esc="active = null">
    <img
      id="bgImg"
      ref="bgImg"
      :src="src"
      alt="Fisioterapi dengan pemantauan gyroscope"
      @load="onImgLoad"
      @error="$event.target.style.display = 'none'"
    />
    <div class="shade"></div>
    <p class="tip" :class="{ hide: active !== null }">Arahkan kursor atau ketuk titik untuk melihat detailnya.</p>

    <div v-for="(s, i) in spots" :key="s.title" class="spot" :style="spotPos(i)">
      <button
        type="button"
        :aria-label="s.title"
        :aria-expanded="active === i"
        @pointerenter="onEnter($event, i)"
        @pointerleave="onLeave($event)"
        @click.stop="onClick($event, i)"
      >
        <span class="ping"></span><span class="core"></span>
      </button>
    </div>

    <div class="modal" :class="{ open: active !== null }" :style="modalStyle" @click.stop>
      <h3>{{ shown.title }}</h3>
      <p>{{ shown.text }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  spots: { type: Array, required: true },
})

const panelEl = ref(null)
const bgImg = ref(null)

const view = ref({ w: 1, h: 1 })
const img = ref({ w: 16, h: 9 })
const isMobile = ref(false)
const active = ref(null)
const last = ref(0)
watch(active, (v) => { if (v !== null) last.value = v })

const onImgLoad = (e) => {
  img.value = { w: e.target.naturalWidth || 16, h: e.target.naturalHeight || 9 }
}
const measure = () => {
  const el = panelEl.value
  if (el) view.value = { w: el.clientWidth, h: el.clientHeight }
}

// Convert image-relative (0-1) hotspot coords to pixel positions,
// accounting for object-fit: cover cropping.
const pts = computed(() => {
  const { w: vw, h: vh } = view.value
  const { w: iw, h: ih } = img.value
  const k = Math.max(vw / iw, vh / ih)
  const dw = iw * k, dh = ih * k, m = 28
  const raw = props.spots.map((s) => ({ x: (vw - dw) / 2 + s.x * dw, y: (vh - dh) / 2 + s.y * dh }))
  const off = raw.some((p) => p.x < m || p.x > vw - m)
  return raw.map((p, i) => ({
    x: off ? vw * (0.2 + 0.3 * i) : p.x,
    y: Math.min(vh - m, Math.max(m, p.y)),
  }))
})
function spotPos(i) {
  const p = pts.value[i]
  return { left: p.x - 20 + 'px', top: p.y - 20 + 'px' }
}

const shown = computed(() => props.spots[last.value])
const modalStyle = computed(() => {
  if (isMobile.value) return {}
  const s = props.spots[last.value]
  const { x, y } = pts.value[last.value]
  const { w, h } = view.value
  const mw = Math.min(288, w * 0.8), gap = 36
  let left = s.side === 'left' ? x - gap - mw : x + gap
  left = Math.min(w - mw - 16, Math.max(16, left))
  const top = Math.min(h - 120, Math.max(120, y))
  return { left: left + 'px', top: top + 'px' }
})

const onEnter = (e, i) => { if (e.pointerType === 'mouse') active.value = i }
const onLeave = (e) => { if (e.pointerType === 'mouse') active.value = null }
const onClick = (e, i) => {
  if (e.pointerType === 'mouse') active.value = i
  else active.value = active.value === i ? null : i
}

let ro, mq
const onMq = (e) => { isMobile.value = e.matches }

onMounted(() => {
  mq = window.matchMedia('(max-width: 768px)')
  isMobile.value = mq.matches
  mq.addEventListener('change', onMq)

  if (bgImg.value && bgImg.value.complete && bgImg.value.naturalWidth) {
    img.value = { w: bgImg.value.naturalWidth, h: bgImg.value.naturalHeight }
  }
  measure()
  ro = new ResizeObserver(measure)
  ro.observe(panelEl.value)
})

onUnmounted(() => {
  ro && ro.disconnect()
  mq && mq.removeEventListener('change', onMq)
})
</script>

<style scoped>
.image-panel { position: absolute; inset: 0; z-index: 30; overflow: hidden; clip-path: inset(100% 0 0 0); background: linear-gradient(135deg, #008DDA, #ACE2E1); }
.image-panel img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; will-change: transform; }
.shade { position: absolute; inset: 0; background: rgba(6,52,79,.25); pointer-events: none; }
.tip { position: absolute; left: 2.5rem; bottom: 2rem; max-width: 20rem; color: #fff; font-size: .9rem; font-weight: 600; transition: opacity .3s; pointer-events: none; }
.tip.hide { opacity: 0; }

.spot { position: absolute; z-index: 40; width: 40px; height: 40px; }
.spot button { position: relative; width: 40px; height: 40px; padding: 0; border: 0; background: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; -webkit-tap-highlight-color: transparent; }
.spot button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.ping { position: absolute; inset: 0; border-radius: 50%; background: rgba(65,201,226,.5); animation: ping 1.8s ease-out infinite; }
.core { position: relative; width: 16px; height: 16px; border-radius: 50%; background: #F7EEDD; box-shadow: 0 0 0 4px rgba(0,141,218,.7); }
@keyframes ping { 0% { transform: scale(.6); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }

.modal { position: absolute; z-index: 45; width: min(18rem, 80%); padding: 1.5rem; background: #F7EEDD; border-radius: 6px; box-shadow: 0 20px 50px rgba(0,0,0,.3); opacity: 0; visibility: hidden; pointer-events: none; transform: translateY(-50%) scale(.97); transition: opacity .3s, transform .3s, visibility .3s; }
.modal.open { opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(-50%) scale(1); }
.modal h3 { color: #008DDA; font-size: 1.25rem; font-weight: 700; margin-bottom: .5rem; }
.modal p { font-size: .9rem; line-height: 1.6; color: rgba(6,52,79,.8); }

@media (max-width: 768px) {
  .tip { left: 1.25rem; right: 1.25rem; bottom: 1.25rem; max-width: none; }
  .modal, .modal.open { left: 1rem; right: 1rem; top: auto; bottom: 4.5rem; width: auto; transform: translateY(12px); }
  .modal.open { transform: none; }
}

@media (prefers-reduced-motion: reduce) { .ping { animation: none; } }
</style>