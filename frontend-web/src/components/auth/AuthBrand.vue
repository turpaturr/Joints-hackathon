<template>
  <RouterLink to="/" class="brand" aria-label="Back to home">
    <span class="brand-mark" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <circle cx="12" cy="12" r="3" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      </svg>
    </span>
    <span class="brand-name">connect<b>monitoring</b></span>
  </RouterLink>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--accent, #0d47a1);
  text-decoration: none;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--accent, #0d47a1);
  color: #fff;
}
.brand-name {
  font-weight: 300;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  color: var(--foreground, #09090b);
}
.brand-name b {
  font-weight: 800;
  margin-left: 0.25em;
}
</style>