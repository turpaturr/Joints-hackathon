<template>
  <div class="dots" aria-hidden="true"></div>
</template>

<style scoped>
.dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle, rgba(144, 202, 249, 0.55) 1.2px, transparent 1.6px),
    radial-gradient(circle, rgba(144, 202, 249, 0.22) 1.2px, transparent 1.6px);
  background-size: 26px 26px, 26px 26px;
  background-position: 0 0, 13px 13px;
  mask-image: radial-gradient(circle at 50% 45%, #000 25%, transparent 78%);
  -webkit-mask-image: radial-gradient(circle at 50% 45%, #000 25%, transparent 78%);
  animation:
    dots-shimmer 6s linear infinite,
    dots-pulse 4s ease-in-out infinite;
}

@keyframes dots-shimmer {
  from { background-position: 0 0, 13px 13px; }
  to   { background-position: 26px 26px, 39px 39px; }
}
@keyframes dots-pulse {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .dots { animation: none; }
}
</style>