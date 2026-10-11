<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { changePassword, getCurrentUser, getSession } from '../../services/auth.api'
import PageHeader from '../../components/ui/PageHeader.vue'
import SurfaceCard from '../../components/ui/SurfaceCard.vue'

const session = getSession()
const profile = ref(session?.user || {})
const loadingProfile = ref(false)
const savingPassword = ref(false)
const notice = ref('')
const error = ref('')
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const name = computed(() => profile.value?.nakesProfile?.namaLengkap || profile.value?.namaLengkap || profile.value?.email || 'Nakes')

onMounted(async () => {
  if (!session?.token) return
  loadingProfile.value = true
  try {
    const response = await getCurrentUser(session.token)
    profile.value = response?.data || response
  } catch (requestError) {
    error.value = requestError.message || 'Profil akun tidak dapat dimuat.'
  } finally {
    loadingProfile.value = false
  }
})

async function updatePassword() {
  notice.value = ''
  error.value = ''
  if (passwordForm.newPassword.length < 6) {
    error.value = 'Kata sandi baru minimal 6 karakter.'
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    error.value = 'Kata sandi baru dan konfirmasi tidak sama.'
    return
  }

  savingPassword.value = true
  try {
    const response = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    }, session?.token)
    notice.value = response?.message || 'Kata sandi berhasil diperbarui.'
    Object.assign(passwordForm, { currentPassword: '', newPassword: '', confirmPassword: '' })
  } catch (requestError) {
    error.value = requestError.message || 'Kata sandi tidak dapat diperbarui.'
  } finally {
    savingPassword.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <PageHeader eyebrow="Preferensi dan keamanan" title="Akun" description="Kelola informasi profil dan keamanan akun Anda." />

    <SurfaceCard>
      <header class="mb-5 flex items-center gap-3 border-b border-line pb-4">
        <span class="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-base font-semibold text-white">{{ name.slice(0, 1).toUpperCase() }}</span>
        <div>
          <p class="mb-1 text-xs font-medium text-primary">Profil Anda</p>
          <h2 class="text-lg font-semibold text-primary-dark">Informasi profil</h2>
        </div>
      </header>
      <div v-if="loadingProfile" class="flex min-h-20 items-center gap-3 text-sm text-muted" role="status">
        <span class="size-5 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" aria-hidden="true" />
        Memuat informasi akun…
      </div>
      <dl v-else class="grid gap-5 sm:grid-cols-2">
        <div>
          <dt class="text-xs text-muted">Nama lengkap</dt>
          <dd class="mt-1 text-sm font-medium text-ink">{{ name }}</dd>
        </div>
        <div>
          <dt class="text-xs text-muted">Alamat email</dt>
          <dd class="mt-1 break-all text-sm font-medium text-ink">{{ profile.email || 'Tidak tersedia' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-muted">Jenis akun</dt>
          <dd class="mt-1 text-sm font-medium text-ink">{{ profile.role || 'NAKES' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-muted">Spesialisasi</dt>
          <dd class="mt-1 text-sm font-medium text-ink">{{ profile.nakesProfile?.spesialisasi || 'Belum diisi' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-muted">Fasilitas kesehatan</dt>
          <dd class="mt-1 text-sm font-medium text-ink">{{ profile.nakesProfile?.faskes || 'Belum diisi' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-muted">Nomor registrasi</dt>
          <dd class="mt-1 text-sm font-medium text-ink">{{ profile.nakesProfile?.nomorRegis || 'Belum diisi' }}</dd>
        </div>
      </dl>
    </SurfaceCard>

    <SurfaceCard>
      <header class="mb-5 border-b border-line pb-4">
        <p class="mb-1 text-xs font-medium text-primary">Keamanan</p>
        <h2 class="text-lg font-semibold text-primary-dark">Ubah kata sandi</h2>
        <p class="mt-1 text-sm text-muted">Gunakan kata sandi saat ini untuk membuat kata sandi baru.</p>
      </header>
      <p v-if="notice" class="mb-4 rounded-panel border border-success/25 bg-success/5 p-3 text-sm text-success" role="status">{{ notice }}</p>
      <p v-if="error" class="mb-4 rounded-panel border border-danger/25 bg-danger/5 p-3 text-sm text-danger" role="alert">{{ error }}</p>
      <form class="grid max-w-xl gap-4" @submit.prevent="updatePassword">
        <label class="grid gap-2 text-sm font-medium text-ink" for="current-password">
          Kata sandi saat ini
          <input id="current-password" v-model="passwordForm.currentPassword" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="password" autocomplete="current-password" required />
        </label>
        <label class="grid gap-2 text-sm font-medium text-ink" for="new-password">
          Kata sandi baru
          <input id="new-password" v-model="passwordForm.newPassword" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="password" autocomplete="new-password" minlength="6" required />
          <small class="font-normal text-muted">Minimal 6 karakter.</small>
        </label>
        <label class="grid gap-2 text-sm font-medium text-ink" for="confirm-password">
          Konfirmasi kata sandi baru
          <input id="confirm-password" v-model="passwordForm.confirmPassword" class="min-h-11 rounded-control border border-line bg-surface px-3 text-sm font-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15" type="password" autocomplete="new-password" required />
        </label>
        <button class="mt-1 min-h-11 rounded-panel bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:bg-disabled sm:w-fit" type="submit" :disabled="savingPassword">
          {{ savingPassword ? 'Memperbarui…' : 'Perbarui kata sandi' }}
        </button>
      </form>
    </SurfaceCard>
  </div>
</template>
