<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { changePassword, getCurrentUser, getSession } from '../../services/auth.api'

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
    error.value = requestError.message || 'Unable to load account profile.'
  } finally {
    loadingProfile.value = false
  }
})

async function updatePassword() {
  notice.value = ''
  error.value = ''
  if (passwordForm.newPassword.length < 6) {
    error.value = 'New password must be at least 6 characters.'
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    error.value = 'New password and confirmation do not match.'
    return
  }

  savingPassword.value = true
  try {
    const response = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    }, session?.token)
    notice.value = response?.message || 'Password updated successfully.'
    Object.assign(passwordForm, { currentPassword: '', newPassword: '', confirmPassword: '' })
  } catch (requestError) {
    error.value = requestError.message || 'Password could not be updated.'
  } finally {
    savingPassword.value = false
  }
}
</script>

<template>
  <div class="account-page">
    <header class="page-intro"><p class="eyebrow">PREFERENCES & SECURITY</p><h2>Account</h2><p>Manage your profile details and account security.</p></header>

    <section class="account-card">
      <header class="card-header"><span class="avatar">{{ name.slice(0, 1).toUpperCase() }}</span><div><p class="eyebrow">YOUR PROFILE</p><h3>Profile information</h3></div></header>
      <div v-if="loadingProfile" class="profile-loading">Loading account…</div>
      <div v-else class="profile-grid">
        <div><small>Full name</small><strong>{{ name }}</strong></div>
        <div><small>Email address</small><strong>{{ profile.email || 'Not available' }}</strong></div>
        <div><small>Account type</small><strong>{{ profile.role || 'NAKES' }}</strong></div>
        <div><small>Specialization</small><strong>{{ profile.nakesProfile?.spesialisasi || 'Not provided' }}</strong></div>
        <div><small>Healthcare facility</small><strong>{{ profile.nakesProfile?.faskes || 'Not provided' }}</strong></div>
        <div><small>Registration number</small><strong>{{ profile.nakesProfile?.nomorRegis || 'Not provided' }}</strong></div>
      </div>
    </section>

    <section class="account-card password-card">
      <header class="card-header"><span class="security-icon">⌑</span><div><p class="eyebrow">SECURITY</p><h3>Change password</h3><p>Use your current password to set a new one.</p></div></header>
      <div v-if="notice" class="feedback success">{{ notice }}</div>
      <div v-if="error" class="feedback error" role="alert">{{ error }}</div>
      <form class="password-form" @submit.prevent="updatePassword">
        <label>Current password<input v-model="passwordForm.currentPassword" type="password" autocomplete="current-password" required /></label>
        <label>New password<input v-model="passwordForm.newPassword" type="password" autocomplete="new-password" minlength="6" required /><small>At least 6 characters.</small></label>
        <label>Confirm new password<input v-model="passwordForm.confirmPassword" type="password" autocomplete="new-password" required /></label>
        <button class="primary-button" type="submit" :disabled="savingPassword">{{ savingPassword ? 'Updating…' : 'Update password' }}</button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.account-page { display: grid; max-width: 900px; gap: 18px; }.page-intro { padding: 2px 2px 5px; }.eyebrow { margin: 0 0 6px; color: #3983bb; font-size: 9px; font-weight: 850; letter-spacing: .14em; }.page-intro h2 { margin: 0; color: #174773; font-size: 25px; }.page-intro > p:last-child { margin: 7px 0 0; color: #758da1; font-size: 12px; }.account-card { padding: 21px; border: 1px solid #deebf7; border-radius: 16px; background: white; box-shadow: 0 12px 30px #1d51820a; }.card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 19px; padding-bottom: 16px; border-bottom: 1px solid #eff3f7; }.avatar, .security-icon { display: grid; width: 40px; height: 40px; flex: 0 0 40px; place-items: center; border-radius: 12px; color: white; background: linear-gradient(145deg, #2196f3, #0d47a1); font-weight: 800; }.security-icon { color: #2b7cb6; background: #e9f5ff; font-size: 22px; }.card-header .eyebrow { margin-bottom: 4px; }.card-header h3 { margin: 0; color: #234b6d; font-size: 15px; }.card-header p:last-child:not(.eyebrow) { margin: 5px 0 0; color: #8498aa; font-size: 10px; }.profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 17px 20px; }.profile-grid > div { display: grid; gap: 6px; }.profile-grid small, .password-form small { color: #8298aa; font-size: 10px; }.profile-grid strong { color: #365a77; font-size: 12px; font-weight: 650; }.profile-loading { padding: 16px 0; color: #7e94a7; font-size: 12px; }.password-form { display: grid; max-width: 540px; gap: 13px; }.password-form label { display: grid; gap: 6px; color: #516b82; font-size: 10px; font-weight: 700; }.password-form input { width: 100%; height: 40px; padding: 0 11px; border: 1px solid #dceaf5; border-radius: 9px; outline: none; color: #244665; background: #fbfdff; font: inherit; font-size: 12px; }.password-form input:focus { border-color: #75b6e6; box-shadow: 0 0 0 3px #e2f2ff; }.password-form small { margin-top: -3px; }.primary-button { min-height: 40px; margin-top: 3px; padding: 0 15px; border: 0; border-radius: 9px; color: white; background: linear-gradient(110deg, #2196f3, #0d47a1); font: inherit; font-size: 11px; font-weight: 750; cursor: pointer; }.primary-button:disabled { opacity: .6; cursor: wait; }.feedback { margin-bottom: 12px; padding: 10px 12px; border-radius: 9px; font-size: 11px; }.feedback.success { color: #337552; background: #effaf4; }.feedback.error { color: #a34b4b; background: #fff4f4; }
@media (max-width: 600px) { .account-card { padding: 16px; }.profile-grid { grid-template-columns: 1fr; gap: 14px; } }
</style>
