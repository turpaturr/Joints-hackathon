<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  sessions: { type: Array, required: true },
  modelValue: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])
const selectedSampleIndex = ref(5)
const enabledAxes = ref(['x', 'y', 'z'])
const axes = [
  { key: 'x', label: 'Sumbu X', color: '#1679ab' },
  { key: 'y', label: 'Sumbu Y', color: '#2fae60' },
  { key: 'z', label: 'Sumbu Z', color: '#8a63c7' },
]
const chart = { width: 800, height: 300, left: 48, right: 20, top: 18, bottom: 36 }
const plotWidth = chart.width - chart.left - chart.right
const plotHeight = chart.height - chart.top - chart.bottom
const selectedSession = computed(() =>
  props.sessions.find((session) => session.id === props.modelValue) ?? props.sessions[0],
)
const selectedSample = computed(() =>
  selectedSession.value.samples[selectedSampleIndex.value] ?? selectedSession.value.samples[0],
)
const maxTime = computed(() => selectedSession.value.samples.at(-1)?.time ?? 120)
const timeTicks = computed(() => Array.from(
  { length: Math.floor(maxTime.value / 20) + 1 },
  (_, index) => index * 20,
))
const chartSeries = computed(() => axes.map((axis) => {
  const points = selectedSession.value.samples.map((sample) => ({
    x: chart.left + (sample.time / maxTime.value) * plotWidth,
    y: chart.top + ((50 - sample[axis.key]) / 100) * plotHeight,
    time: sample.time,
  }))

  return {
    ...axis,
    points,
    path: points.map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
    ).join(' '),
  }
}))

watch(() => props.modelValue, () => {
  selectedSampleIndex.value = Math.min(5, selectedSession.value.samples.length - 1)
})

function formatDate(value, options = { day: 'numeric', month: 'short' }) {
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(value))
}

function formatDuration(durationMs) {
  const totalSeconds = Math.floor(durationMs / 1000)
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`
}

function selectSession(sessionId) {
  emit('update:modelValue', sessionId)
}

function toggleAxis(axis) {
  enabledAxes.value = enabledAxes.value.includes(axis)
    ? enabledAxes.value.filter((item) => item !== axis)
    : [...enabledAxes.value, axis]
}

function selectNearestSample(event) {
  const svg = event.currentTarget.ownerSVGElement
  const bounds = svg.getBoundingClientRect()
  if (!bounds.width) return
  const viewBoxX = ((event.clientX - bounds.left) / bounds.width) * chart.width
  const seconds = Math.max(0, Math.min(maxTime.value, ((viewBoxX - chart.left) / plotWidth) * maxTime.value))
  selectedSampleIndex.value = selectedSession.value.samples.reduce((nearest, sample, index, samples) =>
    Math.abs(sample.time - seconds) < Math.abs(samples[nearest].time - seconds) ? index : nearest, 0)
}
</script>

<template>
  <article class="min-w-0 rounded-card border border-line bg-surface p-4 shadow-(--connect-shadow-card) sm:p-5">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Pemantauan gerakan</p>
        <h2 class="mt-1 text-xl font-semibold text-primary-dark">Data gyroscope</h2>
        <p class="mt-1 text-base text-muted">Pergerakan pasien selama sesi terapi · data demo</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="session in sessions"
          :key="session.id"
          class="min-h-10 rounded-control border px-3 text-sm font-medium transition"
          :class="modelValue === session.id ? 'border-primary bg-primary/5 text-primary-dark' : 'border-line bg-surface text-muted hover:bg-base'"
          type="button"
          @click="selectSession(session.id)"
        >{{ formatDate(session.performedAt) }}</button>
      </div>
    </header>

    <div class="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
      <span>{{ formatDate(selectedSession.performedAt, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }} · {{ formatDuration(selectedSession.durationMs) }}</span>
      <span class="inline-flex items-center gap-1.5"><i class="size-1.5 rounded-full bg-primary" /> Interval sampel: <strong class="font-semibold text-primary-dark">10 detik</strong></span>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        v-for="axis in axes"
        :key="axis.key"
        class="inline-flex min-h-8 items-center gap-2 text-sm transition"
        :class="enabledAxes.includes(axis.key) ? 'text-ink' : 'text-muted/50'"
        type="button"
        :aria-pressed="enabledAxes.includes(axis.key)"
        @click="toggleAxis(axis.key)"
      >
        <span class="h-0.5 w-4 rounded" :style="{ backgroundColor: axis.color }" />
        {{ axis.label }}
        <span class="grid size-5 place-items-center rounded bg-base text-[10px] font-bold text-muted">{{ axis.key.toUpperCase() }}</span>
      </button>
      <span class="ml-auto text-sm text-muted">°/s</span>
    </div>

    <div class="mt-2 overflow-hidden">
      <svg
        class="gyro-chart block w-full touch-pan-y"
        :viewBox="`0 0 ${chart.width} ${chart.height}`"
        role="img"
        aria-label="Grafik kecepatan rotasi gyroscope pada sumbu X, Y, dan Z"
      >
        <g v-for="tick in [-50, -25, 0, 25, 50]" :key="`y-${tick}`">
          <line :x1="chart.left" :x2="chart.width - chart.right" :y1="chart.top + ((50 - tick) / 100) * plotHeight" :y2="chart.top + ((50 - tick) / 100) * plotHeight" class="chart-grid" />
          <text :x="chart.left - 10" :y="chart.top + ((50 - tick) / 100) * plotHeight + 4" text-anchor="end" class="chart-label">{{ tick }}</text>
        </g>
        <g v-for="tick in timeTicks" :key="`x-${tick}`">
          <line :x1="chart.left + (tick / maxTime) * plotWidth" :x2="chart.left + (tick / maxTime) * plotWidth" :y1="chart.top" :y2="chart.height - chart.bottom" class="chart-grid chart-grid-vertical" />
          <text :x="chart.left + (tick / maxTime) * plotWidth" :y="chart.height - 10" text-anchor="middle" class="chart-label">{{ tick }}s</text>
        </g>
        <g v-for="series in chartSeries.filter((axis) => enabledAxes.includes(axis.key))" :key="series.key">
          <path :d="series.path" fill="none" :stroke="series.color" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <circle v-for="point in series.points" :key="`${series.key}-${point.time}`" :cx="point.x" :cy="point.y" r="3" :fill="series.color" class="chart-point" />
          <circle :cx="series.points[selectedSampleIndex]?.x" :cy="series.points[selectedSampleIndex]?.y" r="6" :fill="series.color" stroke="white" stroke-width="2" />
        </g>
        <line
          :x1="chart.left + (selectedSample.time / maxTime) * plotWidth"
          :x2="chart.left + (selectedSample.time / maxTime) * plotWidth"
          :y1="chart.top"
          :y2="chart.height - chart.bottom"
          class="chart-cursor"
        />
        <rect :x="chart.left" :y="chart.top" :width="plotWidth" :height="plotHeight" fill="transparent" @pointermove="selectNearestSample" @pointerdown="selectNearestSample" />
      </svg>
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3">
      <span class="mr-auto inline-flex items-center gap-2 text-sm text-muted"><i class="size-1.5 rounded-full bg-primary" /> Sampel pada <strong class="font-semibold text-primary-dark">{{ selectedSample.time }} detik</strong></span>
      <span v-for="axis in axes.filter((item) => enabledAxes.includes(item.key))" :key="axis.key" class="inline-flex items-center gap-1.5 text-sm">
        <strong :style="{ color: axis.color }">{{ axis.key.toUpperCase() }}</strong>
        <span class="font-semibold text-ink">{{ selectedSample[axis.key] > 0 ? '+' : '' }}{{ selectedSample[axis.key] }}<small class="ml-0.5 font-normal text-muted">°/s</small></span>
      </span>
      <span class="w-full text-right text-xs text-muted">Arahkan kursor ke grafik untuk melihat nilai sampel</span>
    </div>
  </article>
</template>

<style scoped>
.gyro-chart {
  aspect-ratio: 8 / 3;
  max-height: 320px;
}

.chart-grid {
  stroke: var(--connect-border);
  stroke-opacity: 0.7;
  stroke-width: 1;
}

.chart-grid-vertical {
  stroke-opacity: 0.42;
}

.chart-label {
  fill: var(--connect-text-secondary);
  font-family: inherit;
  font-size: 12px;
}

.chart-point {
  stroke: white;
  stroke-width: 1.5;
}

.chart-cursor {
  stroke: var(--connect-primary-dark);
  stroke-dasharray: 4 4;
  stroke-opacity: 0.5;
  stroke-width: 1;
  pointer-events: none;
}
</style>
