<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '../../layouts/AuthLayout.vue'
import AuthForm from '../../components/auth/AuthForm.vue'
import { loginUser, saveSession } from '../../services/auth.api'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

async function handleSubmit({ email, password, platform }) {
  try {
    const response = await loginUser({ email, password, platform })
    const token = response?.data?.token || response?.token
    const user = response?.data?.user || response?.user

    if (!token) throw new Error('Login response did not include an access token.')
    if (user?.role !== 'NAKES') {
      throw new Error('Akun ini tidak memiliki akses ke website tenaga kesehatan.')
    }

    saveSession({ token, user })
    await router.push(route.query.redirect || '/monitoring')
  } catch (error) {
    formRef.value?.setFormError(error?.message || 'Email or password is incorrect.')
    throw error
  }
}
</script>

<template>
  <AuthLayout
    title="Selamat datang kembali"
    description="Masuk untuk memantau pasien dan meninjau aktivitas terapi dalam satu dashboard."
  >
    <AuthForm ref="formRef" @submit="handleSubmit" />

    <template #footer>
      <p class="mt-6 text-sm text-muted">
        Belum memiliki akun?
        <RouterLink to="/register" class="font-medium text-primary underline underline-offset-4">Daftar</RouterLink>
      </p>
    </template>
  </AuthLayout>
</template>
