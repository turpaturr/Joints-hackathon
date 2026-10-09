<template>
  <div class="slide-root">
    <div class="slide-reveal">
      <div
        ref="trackEl"
        class="slide"
        role="group"
        aria-label="Slide to Log In"
      >
        <div class="fill" :style="{ width: x + KNOB + PAD + 'px' }"></div>

        <span class="label" :style="{ opacity: Math.max(0, 1 - progress * 1.6) }">
          {{ label }}
        </span>

        <div
          class="knob"
          :class="{ animating: !dragging }"
          :style="{ transform: `translateX(${x}px)` }"
          role="slider"
          tabindex="0"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.round(progress * 100)"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onUp"
          @keydown.enter.prevent="complete"
          @keydown.right.prevent="complete"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        class="wipe"
        :class="{ animating: !dragging }"
        :style="{
          transform: `translateX(${(progress - 1) * 100}%)`,
          visibility: progress > 0 ? 'visible' : 'hidden',
        }"
      ></div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  to: { type: String, default: '/login' },
  label: { type: String, default: 'Slide to Log In' },
  threshold: { type: Number, default: 0.85 },
})

const KNOB = 52
const PAD = 4

const router = useRouter()
const trackEl = ref(null)
const x = ref(0)
const dragging = ref(false)
let startX = 0
let startOffset = 0
let done = false

const maxX = () => (trackEl.value ? trackEl.value.clientWidth - KNOB - PAD * 2 : 1)
const progress = computed(() => Math.min(1, Math.max(0, x.value / maxX())))

function onDown(e) {
  if (done) return
  dragging.value = true
  startX = e.clientX
  startOffset = x.value
  e.currentTarget.setPointerCapture(e.pointerId)
}

function onMove(e) {
  if (!dragging.value) return
  x.value = Math.min(maxX(), Math.max(0, startOffset + e.clientX - startX))
}

function onUp() {
  if (!dragging.value) return
  dragging.value = false
  if (progress.value >= props.threshold) complete()
  else x.value = 0
}

function complete() {
  if (done) return
  done = true
  dragging.value = false
  x.value = maxX()
  setTimeout(() => router.push(props.to), 450)
}
</script>

<style scoped>
/* 🔑 root tunggal — supaya id/style dari parent bisa inherit */
.slide-root {
  width: 100%;
  display: flex;
  justify-content: center;
}

.slide {
  position: relative;
  width: min(320px, 80vw);
  height: calc(52px + 8px);
  margin: 2rem auto 0;
  border-radius: 999px;
  overflow: hidden;
  pointer-events: auto;
  touch-action: none;
  user-select: none;

  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(247, 238, 221, 0.15),
    rgba(247, 238, 221, 0.45)
  );
}

.label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 40px;
  color: #f7eedd;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgba(247, 238, 221, 0.55) 0%,
    #fff 50%,
    rgba(247, 238, 221, 0.55) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2.4s linear infinite;
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

.knob {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #008dda;
  background: rgba(247, 238, 221, 0.92);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  cursor: grab;
  touch-action: none;
}
.knob:active { cursor: grabbing; }
.knob:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.knob.animating {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.wipe {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background: #008dda;
  box-shadow: 12px 0 40px rgba(0, 0, 0, 0.25);
  will-change: transform;
}
.wipe.animating {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>