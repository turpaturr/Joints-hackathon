<template>
  <div class="art" aria-hidden="true"></div>
</template>

<style scoped>
.art {
  width: min(100%, 460px);
  aspect-ratio: 1 / 1;
  background-image: radial-gradient(circle, rgba(144, 202, 249, 0.35) 1px, transparent 1.5px);
  background-size: 22px 22px;
  mask-image: radial-gradient(circle at 50% 50%, #000 30%, transparent 85%);
  -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 30%, transparent 85%);
}
</style>