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

  if (!form.namaLengkap.trim()) errors.namaLengkap = 'Nama lengkap wajib diisi.'
  if (!form.email) errors.email = 'Email wajib diisi.'
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Masukkan alamat email yang valid.'
  if (!form.password) errors.password = 'Kata sandi wajib diisi.'
  else if (form.password.length < 6) errors.password = 'Kata sandi minimal 6 karakter.'
  if (!form.confirmPassword) errors.confirmPassword = 'Konfirmasi kata sandi wajib diisi.'
  else if (form.confirmPassword !== form.password) errors.confirmPassword = 'Kata sandi tidak sama.'

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
    errors.form = error?.message || 'Akun tidak dapat dibuat. Silakan coba kembali.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout title="Buat akun Nakes" description="Daftarkan akun tenaga kesehatan untuk memulai pemantauan pasien.">
    <form class="grid gap-4" novalidate @submit.prevent="handleSubmit">
      <label class="grid gap-2 text-sm font-medium text-ink" for="name">
        Nama lengkap
        <input id="name" v-model.trim="form.namaLengkap" class="h-12 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="text" autocomplete="name" />
        <small v-if="errors.namaLengkap" class="font-normal text-danger">{{ errors.namaLengkap }}</small>
      </label>
      <label class="grid gap-2 text-sm font-medium text-ink" for="email">
        Email
        <input id="email" v-model.trim="form.email" class="h-12 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="email" autocomplete="email" />
        <small v-if="errors.email" class="font-normal text-danger">{{ errors.email }}</small>
      </label>
      <label class="grid gap-2 text-sm font-medium text-ink" for="password">
        Kata sandi
        <span class="relative block">
          <input id="password" v-model="form.password" class="h-12 w-full rounded-control border border-line bg-surface px-3 pr-20 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" />
          <button class="absolute inset-y-0 right-1 min-h-11 rounded-control px-2 text-xs text-muted hover:bg-base" type="button" :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'" @click="showPassword = !showPassword">{{ showPassword ? 'Sembunyikan' : 'Lihat' }}</button>
        </span>
        <small v-if="errors.password" class="font-normal text-danger">{{ errors.password }}</small>
      </label>
      <label class="grid gap-2 text-sm font-medium text-ink" for="confirm-password">
        Konfirmasi kata sandi
        <input id="confirm-password" v-model="form.confirmPassword" class="h-12 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="password" autocomplete="new-password" />
        <small v-if="errors.confirmPassword" class="font-normal text-danger">{{ errors.confirmPassword }}</small>
      </label>

      <p v-if="errors.form" class="rounded-panel border border-danger/20 bg-danger/5 p-3 text-sm text-danger" role="alert">{{ errors.form }}</p>
      <button class="min-h-12 rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:bg-disabled" type="submit" :disabled="loading">
        {{ loading ? 'Membuat akun…' : 'Buat akun' }}
      </button>
    </form>
    <template #footer>
      <p class="mt-6 text-sm text-muted">Sudah memiliki akun? <RouterLink to="/login" class="font-medium text-primary underline underline-offset-4">Masuk</RouterLink></p>
    </template>
  </AuthLayout>
</template>
