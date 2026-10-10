<template>
  <form class="form" novalidate @submit.prevent="onSubmit">
    <div class="field">
      <label for="email">Email</label>
      <input
        id="email"
        v-model.trim="email"
        type="email"
        autocomplete="username"
        placeholder="name@clinic.com"
        :aria-invalid="!!errors.email"
        @input="errors.email = ''"
      />
      <small v-if="errors.email" class="err">{{ errors.email }}</small>
    </div>

    <div class="field">
      <div class="row">
        <label for="password">Password</label>
        <a href="#" class="link" @click.prevent="$emit('forgot')">Forgot password?</a>
      </div>
      <div class="pw">
        <input
          id="password"
          v-model="password"
          :type="showPw ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="Enter your password"
          :aria-invalid="!!errors.password"
          @input="errors.password = ''"
        />
        <button
          type="button"
          class="eye"
          :aria-label="showPw ? 'Hide password' : 'Show password'"
          :aria-pressed="showPw"
          @click="showPw = !showPw"
        >
          <svg v-if="!showPw" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.4-1M9.9 9.9a3 3 0 0 0 4.2 4.2" />
          </svg>
        </button>
      </div>
      <small v-if="errors.password" class="err">{{ errors.password }}</small>
    </div>

    <label class="check">
      <input v-model="remember" type="checkbox" />
      <span class="box" aria-hidden="true"></span>
      Keep me signed in
    </label>

    <p v-if="errors.form" class="err form-err" role="alert">{{ errors.form }}</p>

    <button class="submit" type="submit" :disabled="loading">
      <span v-if="!loading">Login</span>
      <span v-else class="spinner" aria-label="Signing in"></span>
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['submit', 'forgot'])

const email = ref('')
const password = ref('')
const remember = ref(true)
const showPw = ref(false)
const loading = ref(false)
const errors = reactive({ email: '', password: '', form: '' })

function validate() {
  errors.email = errors.password = errors.form = ''
  if (!email.value) errors.email = 'Enter your email.'
  else if (!/^\S+@\S+\.\S+$/.test(email.value))
    errors.email = 'Enter a valid email, like name@clinic.com.'
  if (!password.value) errors.password = 'Enter your password.'
  return !errors.email && !errors.password
}

async function onSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    await emit('submit', {
      email: email.value,
      password: password.value,
      remember: remember.value,
    })
  } catch (e) {
    errors.form = 'Email or password is incorrect. Check them and try again.'
  } finally {
    loading.value = false
  }
}

defineExpose({
  setFormError(msg) { errors.form = msg },
  reset() { email.value = ''; password.value = '' },
})
</script>

<style scoped>
.form,
.form * {
  box-sizing: border-box;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
label {
  font-size: 0.8125rem;
  font-weight: 500;
}

input[type='email'],
input[type='password'],
input[type='text'] {
  width: 100%;
  height: 36px;
  padding: 0 0.75rem;
  font: inherit;
  font-size: 0.875rem;
  color: var(--foreground, #09090b);
  background: transparent;
  border: 1px solid var(--input, #e4e4e7);
  border-radius: 6px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
input::placeholder { color: var(--muted-foreground, #71717a); }
input:hover { border-color: #d4d4d8; }
input:focus {
  border-color: var(--ring, #18181b);
  box-shadow: 0 0 0 3px rgba(24, 24, 27, 0.1);
}
input[aria-invalid='true'] {
  border-color: var(--destructive, #ef4444);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.pw { position: relative; }
.pw input { padding-right: 3rem; }
.eye {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--muted-foreground, #71717a);
  cursor: pointer;
}
.eye:hover { color: var(--foreground, #09090b); background: var(--muted, #f4f4f5); }
.eye:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--ring, #18181b);
}

.link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground, #09090b);
  text-decoration: underline;
  text-underline-offset: 4px;
}
.link:hover { color: var(--muted-foreground, #71717a); }

.err {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--destructive, #ef4444);
}
.form-err {
  padding: 0.5rem 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-size: 0.75rem;
}

.check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  margin: 0.125rem 0;
}
.check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.check .box {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border: 1px solid var(--input, #e4e4e7);
  border-radius: 4px;
  background: transparent;
  transition: background 0.15s, border-color 0.15s;
}
.check input:checked + .box {
  background: var(--primary, #18181b);
  border-color: var(--primary, #18181b);
}
.check input:checked + .box::after {
  content: '';
  width: 4px;
  height: 8px;
  margin-top: -2px;
  border: solid var(--primary-foreground, #fafafa);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.check input:focus-visible + .box {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--ring, #18181b);
}

.submit {
  display: grid;
  place-items: center;
  height: 36px;
  margin-top: 0.125rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary-foreground, #fafafa);
  background: var(--primary, #18181b);
  border: 1px solid var(--primary, #18181b);
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background 0.15s, opacity 0.15s;
}
.submit:hover:not(:disabled) { background: #27272a; }
.submit:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--ring, #18181b);
}
.submit:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(250, 250, 250, 0.4);
  border-top-color: var(--primary-foreground, #fafafa);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>