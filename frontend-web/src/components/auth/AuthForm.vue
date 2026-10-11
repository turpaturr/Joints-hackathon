<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['submit', 'forgot'])

const email = ref('')
const password = ref('')
const remember = ref(true)
const showPassword = ref(false)
const loading = ref(false)
const errors = reactive({ email: '', password: '', form: '' })

function validate() {
  errors.email = errors.password = errors.form = ''
  if (!email.value) errors.email = 'Masukkan email.'
  else if (!/^\S+@\S+\.\S+$/.test(email.value)) errors.email = 'Masukkan alamat email yang valid.'
  if (!password.value) errors.password = 'Masukkan kata sandi.'
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
  } catch {
    errors.form = 'Email atau kata sandi tidak sesuai. Periksa kembali lalu coba lagi.'
  } finally {
    loading.value = false
  }
}

defineExpose({
  setFormError(message) { errors.form = message },
  reset() { email.value = ''; password.value = '' },
})
</script>

<template>
  <form class="grid gap-5" novalidate @submit.prevent="onSubmit">
    <label class="grid gap-2 text-sm font-medium text-ink" for="email">
      Email
      <input
        id="email"
        v-model.trim="email"
        class="h-12 rounded-control border border-line bg-surface px-3 text-sm font-normal text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        type="email"
        autocomplete="username"
        placeholder="nama@klinik.id"
        :aria-invalid="!!errors.email"
        :aria-describedby="errors.email ? 'email-error' : undefined"
        @input="errors.email = ''"
      />
      <small v-if="errors.email" id="email-error" class="text-sm font-normal text-danger">{{ errors.email }}</small>
    </label>

    <label class="grid gap-2 text-sm font-medium text-ink" for="password">
      Kata sandi
      <span class="relative block">
        <input
          id="password"
          v-model="password"
          class="h-12 w-full rounded-control border border-line bg-surface px-3 pr-12 text-sm font-normal text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="Masukkan kata sandi"
          :aria-invalid="!!errors.password"
          :aria-describedby="errors.password ? 'password-error' : undefined"
          @input="errors.password = ''"
        />
        <button
          class="absolute inset-y-0 right-1 grid min-h-11 min-w-11 place-items-center rounded-control text-muted hover:bg-base"
          type="button"
          :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
          :aria-pressed="showPassword"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? 'Sembunyikan' : 'Lihat' }}
        </button>
      </span>
      <small v-if="errors.password" id="password-error" class="text-sm font-normal text-danger">{{ errors.password }}</small>
    </label>

    <label class="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-muted">
      <input v-model="remember" class="size-4 accent-primary" type="checkbox" />
      Tetap masuk di perangkat ini
    </label>

    <p v-if="errors.form" class="rounded-panel border border-danger/20 bg-danger/5 p-3 text-sm text-danger" role="alert">
      {{ errors.form }}
    </p>

    <button
      class="flex min-h-12 items-center justify-center rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-offset-4 disabled:bg-disabled"
      type="submit"
      :disabled="loading"
    >
      {{ loading ? 'Sedang masuk…' : 'Masuk' }}
    </button>
  </form>
</template>
