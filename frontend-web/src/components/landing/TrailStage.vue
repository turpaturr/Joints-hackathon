<template>
  <ScrollStage ref="scroll" :length="600" stage-id="stage2">
    <div ref="canvasEl" class="canvas">
      <svg ref="svgEl" class="trail" fill="none" preserveAspectRatio="none">
        <path class="trail-base" stroke="#008DDA" stroke-opacity="0.15" stroke-width="2" stroke-linecap="round" />
        <path v-for="n in 5" :key="n" class="trail-seg" stroke="#008DDA" stroke-opacity="0.22" stroke-width="3" stroke-linecap="round" />
        <circle class="trail-head" r="9" fill="#008DDA" />
        <circle class="trail-ring" r="17" fill="none" stroke="#41C9E2" stroke-width="2" />
      </svg>

      <PanelShell variant="cream" title="Teknologi di balik pemantauan">
        <PanelItems :items="tech" />
      </PanelShell>

      <PanelShell variant="mint" title="Layanan program">
        <PanelItems :items="services" variant="list" />
      </PanelShell>

      <PanelShell variant="blue" title="Langkah ke depan">
        <PanelItems :items="roadmap" variant="two" />
      </PanelShell>

      <PanelShell variant="sky" title="Manfaat untuk dokter dan pasien">
        <PanelItems :items="benefits" />
      </PanelShell>
    </div>
  </ScrollStage>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap, ScrollTrigger } from './gsapSetup'
import ScrollStage from './ScrollStage.vue'
import PanelShell from './PanelShell.vue'
import PanelItems from './PanelItems.vue'
import { tech, services, roadmap, benefits } from './landingContent'

const scroll = ref(null)
const canvasEl = ref(null)
const svgEl = ref(null)

let ctx, segs, base, head, ring, total = 1
const prog = { len: 0 }

const size = () => {
  const el = scroll.value.stage
  const w = el.clientWidth, h = el.clientHeight
  return { w, h, pad: w < 768 ? 20 : 48 }
}

// Cumulative path lengths at each corner of the route
const lengths = () => {
  const { w, h, pad } = size()
  const a = h - pad - h * 0.1
  const b = a + (2 * w - 2 * pad)
  const c = b + h
  const d = c + (2 * w - 2 * pad)
  return { a, b, c, d }
}

function layout() {
  if (!svgEl.value || !scroll.value) return
  const { w, h, pad } = size()
  svgEl.value.setAttribute('viewBox', `0 0 ${w * 2} ${h * 2}`)
  const d = `M ${pad} ${h * 0.1} V ${h - pad} H ${w * 2 - pad} V ${h * 2 - pad} H ${pad}`
  base.setAttribute('d', d)
  segs.forEach((s) => s.setAttribute('d', d))
  total = base.getTotalLength()
  draw()
}

function draw() {
  const h = Math.min(prog.len, total)
  const tail = total * 0.22
  segs.forEach((s, i) => {
    const len = tail * ((i + 1) / segs.length)
    s.style.strokeDasharray = `${len} ${total}`
    s.style.strokeDashoffset = len - h
  })
  const p = base.getPointAtLength(h)
  head.setAttribute('cx', p.x); head.setAttribute('cy', p.y)
  ring.setAttribute('cx', p.x); ring.setAttribute('cy', p.y)
}

onMounted(() => {
  const svg = svgEl.value
  segs = [...svg.querySelectorAll('.trail-seg')]
  base = svg.querySelector('.trail-base')
  head = svg.querySelector('.trail-head')
  ring = svg.querySelector('.trail-ring')

  layout()
  ScrollTrigger.addEventListener('refreshInit', layout)

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: scroll.value.track, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true },
    })
    const seg = (from, to, at, dur) =>
      tl.fromTo(prog, { len: from }, { len: to, duration: dur, ease: 'none', onUpdate: draw }, at)

    seg(() => 0, () => lengths().a, 0, 0.6)
    tl.to(canvasEl.value, { xPercent: -50, duration: 1, ease: 'power1.inOut' }, 0.6)
    seg(() => lengths().a, () => lengths().b, 0.6, 1)
    tl.to(canvasEl.value, { yPercent: -50, duration: 1, ease: 'power1.inOut' }, 2)
    seg(() => lengths().b, () => lengths().c, 2, 1)
    tl.to(canvasEl.value, { xPercent: 0, duration: 1, ease: 'power1.inOut' }, 3.4)
    seg(() => lengths().c, () => lengths().d, 3.4, 1)
    tl.to({}, { duration: 0.6 }, 4.4)
  })
})

onUnmounted(() => {
  ScrollTrigger.removeEventListener('refreshInit', layout)
  ctx && ctx.revert()
})
</script>

<style scoped>
.canvas { position: absolute; top: 0; left: 0; width: 200%; height: 200%; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; will-change: transform; }
.trail { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
</style>