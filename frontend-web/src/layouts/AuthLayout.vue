<script setup>
import AuthBrand from '../components/auth/AuthBrand.vue'
import AuthIllustration from '../components/auth/AuthIllustration.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <main class="auth-layout">
    <section class="auth-pane">
      <div class="auth-content">
        <RouterLink to="/" class="auth-back" aria-label="Back to landing">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
               stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </RouterLink>

        <AuthBrand />

        <header class="auth-heading">
          <h1>{{ title }}</h1>
          <p>{{ description }}</p>
        </header>

        <slot />
        <slot name="footer" />
      </div>
    </section>

    <aside class="auth-art-pane" aria-hidden="true">
      <AuthIllustration />
    </aside>
  </main>
</template>

<style>
.auth-layout {
  --background: #fafafa;
  --foreground: #09090b;
  --card: #ffffff;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #18181b;
  --primary: #18181b;
  --primary-foreground: #fafafa;
  --destructive: #ef4444;
  --radius: 0.5rem;
  --accent: #0d47a1;

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  min-height: 100svh;
  background: var(--background);
  color: var(--foreground);
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
}

.auth-layout,
.auth-layout * {
  box-sizing: border-box;
}

.auth-pane {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem);
}

.auth-content {
  position: relative;
  width: 100%;
  max-width: 420px;
  min-width: 0;
  animation: auth-from-left 0.6s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.auth-back {
  position: absolute;
  top: -2.5rem;
  left: 0;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--foreground);
  background: transparent;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
}

.auth-back:hover {
  border-color: #d4d4d8;
  background: var(--muted);
}

.auth-back:active { transform: scale(0.94); }

.auth-back:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
}

.auth-heading { margin: 1.75rem 0 1.5rem; }
.auth-heading h1 { margin: 0; font-size: clamp(1.6rem, 2.6vw, 2rem); line-height: 1.15; font-weight: 700; letter-spacing: -0.025em; }
.auth-heading p { max-width: 34ch; margin: 0.5rem 0 0; color: var(--muted-foreground); font-size: 0.9rem; line-height: 1.5; }
.auth-footer { margin-top: 1.25rem; color: var(--muted-foreground); font-size: 0.875rem; }
.auth-link { color: var(--foreground); font-size: 0.875rem; font-weight: 500; text-decoration: underline; text-underline-offset: 4px; }
.auth-link:hover { color: var(--muted-foreground); }

.auth-art-pane {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  color: #e3f2fd;
  background: #0d47a1;
  animation: auth-reveal 0.8s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes auth-from-left {
  from { opacity: 0; transform: translateX(-28px); }
  to { opacity: 1; transform: none; }
}

@keyframes auth-reveal {
  from { opacity: 0; transform: translateX(40px); filter: blur(8px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
}

@media (max-width: 900px) {
  .auth-layout { grid-template-columns: 1fr; }
  .auth-art-pane { display: none; }
  .auth-pane { align-items: flex-start; padding-top: 4rem; }
}

@media (min-width: 901px) and (max-width: 1100px) {
  .auth-pane { padding-right: clamp(1.5rem, 3vw, 2.5rem); padding-left: clamp(1.5rem, 3vw, 2.5rem); }
  .auth-content { max-width: 360px; }
}

@media (prefers-reduced-motion: reduce) {
  .auth-content, .auth-art-pane { animation: none; }
}
</style>