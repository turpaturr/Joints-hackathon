<template>
  <ScrollStage ref="scroll" :length="500" stage-id="stage1">
    <div id="dot" class="layer dot"></div>

    <div id="scrollHint" class="hint"><span>scroll</span><i></i></div>

    <div id="hero" class="layer center hero">
      <h1 id="heroTitle"><b>connect</b> <span>monitoring</span></h1>
      <p id="heroSub">
        Integrate gyroscope data from physiotherapy patients into a single
        dashboard that can be accessed whenever needed.
      </p>
      <div id="heroSlide">
        <SlideToLogin to="/login" />
      </div>
    </div>

    <HotspotImage :src="imageSrc" :spots="hotspots" />
  </ScrollStage>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from './gsapSetup'
import ScrollStage from './ScrollStage.vue'
import HotspotImage from './HotspotImage.vue'
import { hotspots } from './landingContent'
import SlideToLogin from './SlideToLogin.vue'

defineProps({
  imageSrc: { type: String, required: true },
})

const scroll = ref(null)
let ctx, trigger

function scrollToStart() {
  window.scrollTo({ top: trigger ? trigger.start : 0, behavior: 'smooth' })
}
defineExpose({ scrollToStart })

onMounted(() => {
  const { track, stage } = scroll.value

  ctx = gsap.context(() => {
    // Ganti bagian timeline di HeroStage.vue dengan ini
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: track,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    invalidateOnRefresh: true,
  },
})

tl.to('#scrollHint', { opacity: 0, duration: 0.2 }, 0)

  // === FASE 1: dot membuka (0 → 2) ===
  .fromTo(
    '#dot',
    { clipPath: 'circle(8px at 50% 50%)' },
    {
      clipPath: () =>
        `circle(${Math.hypot(stage.clientWidth, stage.clientHeight) / 2 + 4}px at 50% 50%)`,
      duration: 2,
      ease: 'power2.in',
    },
    0
  )

  // === FASE 2: TAHAN di biru full (2 → 2.6) — biar user lihat biru penuh ===
  .to({}, { duration: 0.6 }, 2)

  // === FASE 3: judul muncul ===
  .fromTo('#heroTitle', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 2.6)
  .fromTo('#heroSub',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 2.9)

  // === FASE 4: slider muncul dari bawah setelah judul & sub settle ===
  .fromTo(
    '#heroSlide',
    { autoAlpha: 0, y: 60, scale: 0.9 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
    3.4
  )

  // === FASE 5: hero fade out ===
  .to('#hero', { opacity: 0, duration: 0.8 }, 4.6)

  // === FASE 6: image panel masuk ===
  .fromTo(
    '#imagePanel',
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'power2.inOut' },
    4.8
  )
  .fromTo('#bgImg', { scale: 1.3 }, { scale: 1, duration: 3, ease: 'none' }, 4.8)

  // === FASE 7: hotspot ===
  .from('.spot', { scale: 0, autoAlpha: 0, stagger: 0.25, duration: 0.6, ease: 'back.out(2)' }, 7.5)
  .to({}, { duration: 1 })

    trigger = tl.scrollTrigger
  }, track)
})

onUnmounted(() => {
  ctx && ctx.revert()
})
</script>

<style scoped>
.layer { position: absolute; inset: 0; }
.center { display: flex; align-items: center; justify-content: center; }

.dot {
  background: #008dda;
  clip-path: circle(8px at 50% 50%);
}

.hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #008dda;
  font-size: 0.85rem;
  font-weight: 600;
}
.hint i {
  display: block;
  width: 1px;
  height: 3rem;
  background: rgba(0, 141, 218, 0.5);
}

.hero {
  z-index: 20;
  flex-direction: column;
  text-align: center;
  padding: 0 1.5rem;
  pointer-events: none;
}
.hero h1 {
  font-size: clamp(2.6rem, min(11vw, 18svh), 9rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: #f7eedd;
  font-weight: 300;
}
.hero h1 b { font-weight: 800; }
.hero h1 span { font-size: 0.5em; display: block; margin-top: -0.15em; }
.hero p {
  margin-top: 1.5rem;
  max-width: 38rem;
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-weight: 300;
  color: rgba(247, 238, 221, 0.9);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero h1 b,
  .hero h1 span { display: block; }
}
@media (max-height: 560px) and (orientation: landscape),
  (max-width: 900px) and (orientation: landscape) {
  .hero p { display: none; }
}
</style>