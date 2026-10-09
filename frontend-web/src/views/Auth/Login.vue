<template>
  <main class="login">
    <!-- KIRI: form -->
    <section class="pane form-pane">
      <div class="form-wrap">
        <!-- tombol back bulat -->
        <RouterLink to="/" class="back-btn" aria-label="Back to landing">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
               stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </RouterLink>

        <AuthBrand />

        <header class="head">
          <h1>Welcome back</h1>
          <p>Sign in to see your patients' gyroscope data in one dashboard.</p>
        </header>

        <AuthForm
          ref="formRef"
          @submit="handleSubmit"
          @forgot="$emit('forgot')"
        />

        <p class="foot">
          Don't have an account?
          <a href="#" class="link" @click.prevent="$emit('register')">
            Ask your administrator
          </a>
        </p>
      </div>
    </section>

    <!-- KANAN: ilustrasi -->
    <aside class="pane art-pane" aria-hidden="true">
      <AuthIllustration />
    </aside>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthBrand from '../../components/auth/AuthBrand.vue'
import AuthForm from '../../components/auth/AuthForm.vue'
import AuthIllustration from '../../components/auth/AuthIllustration.vue'

defineEmits(['forgot', 'register'])

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

async function handleSubmit({ email, password, remember }) {
  try {
    await new Promise((r) => setTimeout(r, 900))
    router.push(route.query.redirect || '/monitoring')
  } catch (e) {
    formRef.value?.setFormError(
      'Email or password is incorrect. Check them and try again.'
    )
    throw e
  }
}
</script>

<style scoped>
.login {
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

/* ---------- KIRI ---------- */
.form-pane {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem);
}
.form-wrap {
  position: relative;
  width: 100%;
  max-width: 400px;
  min-width: 0;
  animation: from-left 0.6s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* tombol back bulat */
.back-btn {
  position: absolute;
  top: -2.5rem;
  left: 0;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--foreground);
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
}
.back-btn:hover {
  background: var(--muted);
  border-color: #d4d4d8;
}
.back-btn:active { transform: scale(0.94); }
.back-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
}

.head { margin: 1.75rem 0 1.5rem; }
.head h1 {
  font-size: clamp(1.6rem, 2.6vw, 2rem);
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.025em;
}
.head p {
  margin-top: 0.5rem;
  line-height: 1.5;
  font-size: 0.9rem;
  color: var(--muted-foreground);
  max-width: 34ch;
}

.foot {
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}
.link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  text-decoration: underline;
  text-underline-offset: 4px;
}
.link:hover { color: var(--muted-foreground); }

/* ---------- KANAN ---------- */
.art-pane {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  background: #0d47a1;   /* biru solid, sama seperti sebelumnya */
  color: #e3f2fd;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  animation: reveal 0.8s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.caption {
  position: relative;
  margin-top: 2rem;
  font-weight: 300;
  font-size: 1rem;
  color: #90caf9;
  text-align: center;
}

@keyframes from-left {
  from { opacity: 0; transform: translateX(-28px); }
  to   { opacity: 1; transform: none; }
}
@keyframes reveal {
  from { opacity: 0; transform: translateX(40px); filter: blur(8px); }
  to   { opacity: 1; transform: translateX(0);   filter: blur(0); }
}

@media (max-width: 900px) {
  .login { grid-template-columns: 1fr; }
  .art-pane { display: none; }
  .form-pane { align-items: flex-start; padding-top: 4rem; }
  .back-btn { top: -2.5rem; }
}
@media (min-width: 901px) and (max-width: 1100px) {
  .form-pane { padding-left: clamp(1.5rem, 3vw, 2.5rem); padding-right: clamp(1.5rem, 3vw, 2.5rem); }
  .form-wrap { max-width: 360px; }
}
@media (prefers-reduced-motion: reduce) {
  .form-wrap, .art-pane { animation: none; }
}
</style>