<template>
  <div ref="track" class="track" :style="{ '--len': length }">
    <section :id="stageId" ref="stage" class="stage">
      <slot />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// length = scroll distance in viewport heights (e.g. 500 => 500vh)
defineProps({
  length: { type: Number, required: true },
  stageId: { type: String, default: undefined },
})

const track = ref(null)
const stage = ref(null)

// Parents use these as the ScrollTrigger trigger / for measuring.
defineExpose({ track, stage })
</script>

<style scoped>
.track {
  position: relative;
  width: 100%;
  height: calc(var(--len) * 1vh);
  height: calc(var(--len) * 1svh);
}
.stage {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  contain: paint;
  isolation: isolate;
  background: #F7EEDD;
}
</style>