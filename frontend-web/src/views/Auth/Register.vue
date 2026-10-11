<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../../layouts/AuthLayout.vue'
import { registerUser, saveSession } from '../../services/auth.api'

const router = useRouter()
const showPassword = ref(false)
const loading = ref(false)

const form = reactive({
  namaLengkap: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  namaLengkap: '',
  email: '',
  password: '',
  confirmPassword: '',
  form: '',
})

function validate() {
  errors.namaLengkap = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.form = ''

  if (!form.namaLengkap.trim()) errors.namaLengkap = 'Full name is required.'
  if (!form.email) errors.email = 'Email is required.'
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email.'
  if (!form.password) errors.password = 'Password is required.'
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.'

  return !errors.namaLengkap && !errors.email && !errors.password && !errors.confirmPassword
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  try {
    const response = await registerUser({
      namaLengkap: form.namaLengkap,
      email: form.email,
      password: form.password,
      role: 'NAKES',
    })
    const token = response?.data?.token || response?.token
    const user = response?.data?.user || {
      email: form.email,
      namaLengkap: form.namaLengkap,
      role: 'NAKES',
    }

    if (token) {
      saveSession({ token, user })
      await router.push('/monitoring')
      return
    }

    await router.push({ name: 'login', query: { registered: '1' } })
  } catch (error) {
    errors.form = error?.message || 'Unable to create account. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout
    title="Create account"
    description="Set up a monitoring account for your clinic team and start tracking patient care."
  >
    <form class="register-form" novalidate @submit.prevent="handleSubmit">
      <label class="register-field">
        <span>Full name</span>
        <input v-model.trim="form.namaLengkap" type="text" autocomplete="name" placeholder="Dr. Andi Wijaya" />
        <small v-if="errors.namaLengkap" class="register-error">{{ errors.namaLengkap }}</small>
      </label>

      <label class="register-field">
        <span>Email</span>
        <input v-model.trim="form.email" type="email" autocomplete="email" placeholder="name@clinic.com" />
        <small v-if="errors.email" class="register-error">{{ errors.email }}</small>
      </label>

      <label class="register-field">
        <span>Password</span>
        <span class="register-password">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Create a password"
          />
          <button
            class="register-password-toggle"
            type="button"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <svg v-if="!showPassword" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.4-1M9.9 9.9a3 3 0 0 0 4.2 4.2" />
            </svg>
          </button>
        </span>
        <small v-if="errors.password" class="register-error">{{ errors.password }}</small>
      </label>

      <label class="register-field">
        <span>Confirm password</span>
        <input v-model="form.confirmPassword" type="password" autocomplete="new-password" placeholder="Repeat your password" />
        <small v-if="errors.confirmPassword" class="register-error">{{ errors.confirmPassword }}</small>
      </label>

      <p v-if="errors.form" class="register-form-error" role="alert">{{ errors.form }}</p>

      <button class="register-submit" type="submit" :disabled="loading">
        <span v-if="!loading">Create account</span>
        <span v-else class="register-spinner" aria-label="Creating account"></span>
      </button>
    </form>

    <template #footer>
      <p class="auth-footer">
        Already have an account?
        <RouterLink to="/login" class="auth-link">Sign in</RouterLink>
      </p>
    </template>
  </AuthLayout>
</template>

<style>
.register-form { display: flex; flex-direction: column; gap: 0.875rem; }
.register-field { display: flex; flex-direction: column; gap: 0.35rem; color: var(--foreground); font-size: 0.8125rem; font-weight: 500; }
.register-field input { width: 100%; height: 40px; padding: 0 0.75rem; border: 1px solid var(--input); border-radius: 6px; outline: none; color: var(--foreground); background: transparent; font: inherit; font-size: 0.875rem; transition: border-color 0.15s, box-shadow 0.15s; }
.register-field input::placeholder { color: var(--muted-foreground); }
.register-field input:hover { border-color: #d4d4d8; }
.register-field input:focus { border-color: var(--ring); box-shadow: 0 0 0 3px rgba(24, 24, 27, 0.1); }
.register-password { position: relative; display: block; }
.register-password input { padding-right: 3rem; }
.register-password-toggle { position: absolute; top: 50%; right: 4px; display: grid; width: 32px; height: 32px; place-items: center; transform: translateY(-50%); border: 0; border-radius: 4px; color: var(--muted-foreground); background: transparent; cursor: pointer; }
.register-password-toggle:hover { color: var(--foreground); background: var(--muted); }
.register-error { color: var(--destructive); font-size: 0.75rem; font-weight: 500; }
.register-form-error { margin: 0; padding: 0.5rem 0.75rem; border: 1px solid #fecaca; border-radius: 6px; color: var(--destructive); background: #fef2f2; font-size: 0.75rem; }
.register-submit { display: grid; min-height: 40px; place-items: center; margin-top: 0.125rem; border: 1px solid var(--primary); border-radius: 6px; color: var(--primary-foreground); background: var(--primary); font: inherit; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.register-submit:disabled { opacity: 0.7; cursor: wait; }
.register-spinner { width: 16px; height: 16px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: register-spin 0.7s linear infinite; }
@keyframes register-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .register-field input, .register-spinner { transition: none; animation: none; } }
</style>
