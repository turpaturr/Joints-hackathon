<script setup>
import { computed, reactive, ref } from 'vue'
import { getSession } from '../../services/auth.api'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import { createMovement, createPrescription } from '../../services/therapy.api'

const token = getSession()?.token
const busy = ref(false)
const notice = ref('')
const error = ref('')
const movementForm = reactive({ namaGerakan: '', deskripsi: '', instruksi: '', mediaUrl: '', mediaType: 'VIDEO' })
const prescriptionForm = reactive({
  patientId: '',
  movementId: '',
  targetRepetisi: 10,
  frekuensiPerHari: 2,
  tanggalMulai: new Date().toISOString().slice(0, 10),
  tanggalBerakhir: '',
})
const sortedPrescriptions = computed(() =>
  [...monitoringData.prescriptions].sort((a, b) => new Date(b.createdAt || b.tanggalMulai) - new Date(a.createdAt || a.tanggalMulai)),
)

async function addMovement() {
  error.value = notice.value = ''
  if (!movementForm.namaGerakan.trim() || !movementForm.instruksi.trim()) {
    error.value = 'Movement name and instructions are required.'
    return
  }

  busy.value = true
  try {
    await createMovement({
      ...movementForm,
      deskripsi: movementForm.deskripsi || undefined,
      mediaUrl: movementForm.mediaUrl || undefined,
    }, token)
    notice.value = 'Movement saved to the backend library.'
    Object.assign(movementForm, { namaGerakan: '', deskripsi: '', instruksi: '', mediaUrl: '', mediaType: 'VIDEO' })
    await refreshMonitoringData(token)
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    busy.value = false
  }
}

async function addPrescription() {
  error.value = notice.value = ''
  if (!prescriptionForm.patientId || !prescriptionForm.movementId || !prescriptionForm.tanggalBerakhir) {
    error.value = 'Choose a patient and movement, and set the end date.'
    return
  }

  busy.value = true
  try {
    await createPrescription({
      patientId: prescriptionForm.patientId,
      movementId: prescriptionForm.movementId,
      targetRepetisi: Number(prescriptionForm.targetRepetisi),
      frekuensiPerHari: Number(prescriptionForm.frekuensiPerHari),
      tanggalMulai: new Date(`${prescriptionForm.tanggalMulai}T00:00:00`).toISOString(),
      tanggalBerakhir: new Date(`${prescriptionForm.tanggalBerakhir}T23:59:59`).toISOString(),
    }, token)
    notice.value = 'Therapy plan created and saved.'
    await refreshMonitoringData(token)
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="therapy-page">
    <header class="page-intro"><div><p class="eyebrow">THERAPY MANAGEMENT</p><h2>Therapy</h2><p>Manage the movement library and assign a therapy plan to a patient.</p></div><span class="count-pill">{{ monitoringData.movements.length }} movements</span></header>

    <div v-if="notice" class="notice success">{{ notice }}</div>
    <div v-if="error" class="notice error" role="alert">{{ error }}</div>

    <div class="therapy-grid">
      <section class="content-card">
        <header class="card-heading"><span class="card-icon">+</span><div><h3>Create therapy plan</h3><p>Assign a movement to one of your patients.</p></div></header>
        <form class="form-grid" @submit.prevent="addPrescription">
          <label class="wide">Patient
            <select v-model="prescriptionForm.patientId" required>
              <option value="" disabled>Select assigned patient</option>
              <option v-for="patient in monitoringData.patients" :key="patient.id" :value="patient.id">{{ patient.namaLengkap }} · {{ patient.user?.email }}</option>
            </select>
          </label>
          <label class="wide">Movement
            <select v-model="prescriptionForm.movementId" required>
              <option value="" disabled>Select a movement</option>
              <option v-for="movement in monitoringData.movements" :key="movement.id" :value="movement.id">{{ movement.namaGerakan }}</option>
            </select>
          </label>
          <label>Target repetitions<input v-model.number="prescriptionForm.targetRepetisi" type="number" min="1" required /></label>
          <label>Times per day<input v-model.number="prescriptionForm.frekuensiPerHari" type="number" min="1" required /></label>
          <label>Start date<input v-model="prescriptionForm.tanggalMulai" type="date" required /></label>
          <label>End date<input v-model="prescriptionForm.tanggalBerakhir" type="date" :min="prescriptionForm.tanggalMulai" required /></label>
          <button class="primary-button wide" type="submit" :disabled="busy || !monitoringData.patients.length || !monitoringData.movements.length">{{ busy ? 'Saving…' : 'Create plan' }}</button>
          <p v-if="!monitoringData.patients.length || !monitoringData.movements.length" class="form-hint wide">A patient must be assigned and at least one movement must exist before creating a plan.</p>
        </form>
      </section>

      <section class="content-card">
        <header class="card-heading"><span class="card-icon green">↗</span><div><h3>Add movement</h3><p>Create an item in the shared therapy library.</p></div></header>
        <form class="form-grid" @submit.prevent="addMovement">
          <label class="wide">Movement name<input v-model.trim="movementForm.namaGerakan" type="text" placeholder="e.g. Knee flexion" required /></label>
          <label class="wide">Description<input v-model.trim="movementForm.deskripsi" type="text" placeholder="Short description (optional)" /></label>
          <label class="wide">Instructions<textarea v-model.trim="movementForm.instruksi" rows="3" placeholder="Instructions for the patient" required></textarea></label>
          <label>Media type<select v-model="movementForm.mediaType"><option value="VIDEO">Video</option><option value="IMAGE">Image</option></select></label>
          <label>Media URL<input v-model.trim="movementForm.mediaUrl" type="url" placeholder="https://…" /></label>
          <button class="secondary-button wide" type="submit" :disabled="busy">{{ busy ? 'Saving…' : 'Save movement' }}</button>
        </form>
      </section>
    </div>

    <section class="content-card">
      <header class="section-header"><div><p class="eyebrow">PATIENT CARE</p><h3>Therapy plans</h3></div><span class="count-pill">{{ sortedPrescriptions.length }} plans</span></header>
      <div v-if="!sortedPrescriptions.length" class="empty-state"><span class="empty-icon">RX</span><strong>No therapy plans found</strong><p>Plans assigned to your patients will be listed here.</p></div>
      <div v-else class="plan-list">
        <article v-for="plan in sortedPrescriptions" :key="plan.id" class="plan-row">
          <span class="movement-icon">✳</span>
          <div class="plan-main"><strong>{{ plan.movement?.namaGerakan || 'Therapy movement' }}</strong><small>{{ monitoringData.patients.find((patient) => patient.id === plan.patientId)?.namaLengkap || `Patient ${plan.patientId.slice(0, 8)}` }}</small></div>
          <span class="plan-meta">{{ plan.targetRepetisi }} reps · {{ plan.frekuensiPerHari }}× daily</span>
          <span class="plan-dates">{{ new Date(plan.tanggalMulai).toLocaleDateString() }} – {{ new Date(plan.tanggalBerakhir).toLocaleDateString() }}</span>
        </article>
      </div>
    </section>

    <section class="content-card">
      <header class="section-header"><div><p class="eyebrow">MOVEMENT LIBRARY</p><h3>Available movements</h3></div><span class="count-pill">{{ monitoringData.movements.length }} items</span></header>
      <div v-if="!monitoringData.movements.length" class="empty-state"><span class="empty-icon">TH</span><strong>Library is empty</strong><p>Add a movement above to make it available for patient plans.</p></div>
      <div v-else class="movement-grid">
        <article v-for="movement in monitoringData.movements" :key="movement.id" class="movement-card"><div><span class="movement-icon">✳</span><span class="media-pill">{{ movement.mediaType || 'Exercise' }}</span></div><h4>{{ movement.namaGerakan }}</h4><p>{{ movement.instruksi }}</p><a v-if="movement.mediaUrl" :href="movement.mediaUrl" target="_blank" rel="noreferrer">Open media ↗</a></article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.therapy-page { display: grid; gap: 18px; }.page-intro, .section-header { display: flex; align-items: end; justify-content: space-between; gap: 14px; }.eyebrow { margin: 0 0 6px; color: #3983bb; font-size: 9px; font-weight: 850; letter-spacing: .14em; }.page-intro h2 { margin: 0; color: #174773; font-size: 25px; }.page-intro p:not(.eyebrow) { margin: 7px 0 0; color: #758da1; font-size: 12px; }.count-pill, .media-pill { display: inline-flex; align-items: center; padding: 7px 10px; border: 1px solid #deebf6; border-radius: 99px; color: #5680a0; background: #f7fbff; font-size: 10px; font-weight: 700; white-space: nowrap; }.therapy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }.content-card { min-width: 0; padding: 19px; border: 1px solid #deebf7; border-radius: 16px; background: white; box-shadow: 0 12px 30px #1d51820a; }.card-heading { display: flex; align-items: center; gap: 11px; margin-bottom: 17px; }.card-icon, .movement-icon { display: grid; width: 34px; height: 34px; flex: 0 0 34px; place-items: center; border-radius: 10px; color: #277abb; background: #e9f5ff; font-size: 17px; font-weight: 700; }.card-icon.green, .movement-icon { color: #448c70; background: #eaf8f1; }.card-heading h3, .section-header h3 { margin: 0; color: #234b6d; font-size: 15px; }.card-heading p { margin: 5px 0 0; color: #8498aa; font-size: 10px; }.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }.form-grid label { display: grid; align-content: start; gap: 6px; color: #516b82; font-size: 10px; font-weight: 700; }.form-grid .wide { grid-column: 1 / -1; }.form-grid input, .form-grid select, .form-grid textarea { width: 100%; min-width: 0; min-height: 39px; padding: 9px 10px; border: 1px solid #dceaf5; border-radius: 9px; outline: 0; color: #244665; background: #fbfdff; font: inherit; font-size: 11px; }.form-grid textarea { resize: vertical; }.form-grid input:focus, .form-grid select:focus, .form-grid textarea:focus { border-color: #75b6e6; box-shadow: 0 0 0 3px #e2f2ff; }.primary-button, .secondary-button { min-height: 40px; border-radius: 9px; font: inherit; font-size: 11px; font-weight: 750; cursor: pointer; }.primary-button { border: 0; color: white; background: linear-gradient(110deg, #2196f3, #0d47a1); }.secondary-button { border: 1px solid #cfe4f4; color: #21699e; background: #f5fbff; }.primary-button:disabled, .secondary-button:disabled { opacity: .55; cursor: not-allowed; }.form-hint { margin: -3px 0 0; color: #8297a9; font-size: 10px; line-height: 1.5; }.notice { padding: 11px 13px; border-radius: 10px; font-size: 11px; }.notice.success { border: 1px solid #c4e8d4; color: #337552; background: #effaf4; }.notice.error { border: 1px solid #f1cece; color: #a34b4b; background: #fff4f4; }.section-header { align-items: center; margin-bottom: 16px; }.section-header .eyebrow { margin-bottom: 4px; }.empty-state { display: grid; min-height: 130px; align-content: center; justify-items: center; text-align: center; }.empty-state strong { margin-top: 10px; color: #476783; font-size: 12px; }.empty-state p { margin: 5px 0 0; color: #899cad; font-size: 10px; }.empty-icon { display: grid; width: 35px; height: 35px; place-items: center; border-radius: 10px; color: #4487b5; background: #eaf5ff; font-size: 9px; font-weight: 850; }.plan-list { display: grid; }.plan-row { display: flex; align-items: center; gap: 11px; min-height: 62px; border-bottom: 1px solid #eff3f7; }.plan-main { display: grid; min-width: 130px; flex: 1; gap: 4px; }.plan-main strong { color: #315979; font-size: 11px; }.plan-main small, .plan-dates { color: #8499aa; font-size: 9px; }.plan-meta { color: #44799f; font-size: 10px; white-space: nowrap; }.movement-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 11px; }.movement-card { padding: 14px; border: 1px solid #e6eff6; border-radius: 12px; background: #fcfdff; }.movement-card > div { display: flex; align-items: center; justify-content: space-between; }.movement-card .movement-icon { width: 28px; height: 28px; flex-basis: 28px; }.media-pill { padding: 5px 8px; font-size: 8px; }.movement-card h4 { margin: 12px 0 5px; color: #315979; font-size: 12px; }.movement-card p { min-height: 37px; margin: 0; color: #8296a8; font-size: 10px; line-height: 1.5; }.movement-card a { display: inline-block; margin-top: 10px; color: #2679b7; font-size: 10px; text-decoration: none; }.movement-card a:hover { text-decoration: underline; }
@media (max-width: 850px) { .therapy-grid { grid-template-columns: 1fr; }.movement-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .page-intro { align-items: flex-start; flex-direction: column; }.plan-row { align-items: flex-start; flex-wrap: wrap; padding: 12px 0; }.plan-main { min-width: calc(100% - 48px); }.plan-meta { margin-left: 45px; }.plan-dates { margin-left: auto; }.movement-grid { grid-template-columns: 1fr; }.form-grid { grid-template-columns: 1fr; }.form-grid .wide { grid-column: auto; } }
</style>
