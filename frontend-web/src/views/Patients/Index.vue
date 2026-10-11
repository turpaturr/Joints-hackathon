<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { monitoringData } from '../../composables/useMonitoringData'

const route = useRoute()
const search = ref('')
const selectedPatientId = ref(route.query.patient || '')
const filteredPatients = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return monitoringData.patients
  return monitoringData.patients.filter((patient) =>
    [patient.namaLengkap, patient.user?.email, patient.kondisiMedis, patient.nomorTelepon]
      .some((value) => value?.toLowerCase().includes(query)),
  )
})
</script>

<template>
  <section class="patients-page">
    <header class="page-intro">
      <div><p class="eyebrow">CARE TEAM</p><h2>Patients</h2><p>Profiles assigned to your healthcare account.</p></div>
      <label class="search-box"><span aria-hidden="true">⌕</span><input v-model="search" type="search" placeholder="Search patients" aria-label="Search patients" /></label>
    </header>

    <div class="presence-disclaimer"><span>i</span><p><strong>Presence tracking is not available in the backend yet.</strong> Online/offline indicators are intentionally shown as unavailable.</p></div>

    <div v-if="monitoringData.loading && !monitoringData.patients.length" class="blank-state">Loading patient records…</div>
    <div v-else-if="!filteredPatients.length" class="blank-state">
      <span class="empty-icon">PT</span>
      <h3>{{ search ? 'No matching patients' : 'No assigned patients' }}</h3>
      <p>{{ search ? 'Try another name, email, or condition.' : 'Patient profiles will appear after they are linked to your nakes profile in the backend.' }}</p>
    </div>

    <div v-else class="patient-layout">
      <div class="patient-list">
        <button v-for="patient in filteredPatients" :key="patient.id" :class="['patient-card', { selected: selectedPatientId === patient.id }]" @click="selectedPatientId = patient.id">
          <span class="patient-avatar">{{ patient.namaLengkap?.slice(0, 1) || 'P' }}</span>
          <span class="patient-identity"><strong>{{ patient.namaLengkap }}</strong><small>{{ patient.user?.email || 'Email not provided' }}</small></span>
          <span class="patient-card-arrow">›</span>
          <span class="condition">{{ patient.kondisiMedis || 'Medical condition not specified' }}</span>
        </button>
      </div>

      <article v-if="filteredPatients.find((patient) => patient.id === selectedPatientId) || filteredPatients[0]" class="patient-detail">
        <template v-for="patient in [filteredPatients.find((item) => item.id === selectedPatientId) || filteredPatients[0]]" :key="patient.id">
          <header class="detail-heading">
            <span class="patient-avatar large">{{ patient.namaLengkap?.slice(0, 1) || 'P' }}</span>
            <div><p class="eyebrow">PATIENT PROFILE</p><h3>{{ patient.namaLengkap }}</h3><span>{{ patient.user?.email || 'Email not provided' }}</span></div>
          </header>
          <div class="detail-grid">
            <div><small>Medical condition</small><strong>{{ patient.kondisiMedis || 'Not specified' }}</strong></div>
            <div><small>Phone</small><strong>{{ patient.nomorTelepon || 'Not provided' }}</strong></div>
            <div><small>Date of birth</small><strong>{{ patient.tanggalLahir ? new Date(patient.tanggalLahir).toLocaleDateString() : 'Not provided' }}</strong></div>
            <div><small>Gender</small><strong>{{ patient.jenisKelamin || 'Not provided' }}</strong></div>
            <div class="wide"><small>Initial notes</small><strong>{{ patient.catatanAwal || 'No initial notes' }}</strong></div>
            <div class="wide"><small>Address</small><strong>{{ patient.alamat || 'Not provided' }}</strong></div>
          </div>
          <div class="detail-footer">
            <div><small>Therapy sessions recorded</small><strong>{{ patient._count?.therapySessions ?? 0 }}</strong></div>
            <span class="unavailable"><i></i> Online status unavailable</span>
          </div>
        </template>
      </article>
    </div>
  </section>
</template>

<style scoped>
.patients-page { display: grid; gap: 18px; }.page-intro { display: flex; align-items: end; justify-content: space-between; gap: 18px; }.eyebrow { margin: 0 0 7px; color: #3983bb; font-size: 9px; font-weight: 850; letter-spacing: .14em; }.page-intro h2 { margin: 0; color: #174773; font-size: 25px; }.page-intro p:not(.eyebrow) { margin: 7px 0 0; color: #758da1; font-size: 12px; }
.search-box { display: flex; width: min(300px, 100%); height: 42px; align-items: center; gap: 9px; padding: 0 12px; border: 1px solid #dbeaf6; border-radius: 11px; background: #fff; color: #7e9bb0; }.search-box span { font-size: 22px; }.search-box input { width: 100%; border: 0; outline: 0; color: #254765; background: transparent; font: inherit; font-size: 12px; }
.presence-disclaimer { display: flex; align-items: center; gap: 11px; padding: 12px 14px; border: 1px solid #d8e9f6; border-radius: 12px; color: #617d93; background: #f8fcff; font-size: 11px; }.presence-disclaimer > span { display: grid; width: 22px; height: 22px; flex: 0 0 22px; place-items: center; border-radius: 50%; color: #2878b5; background: #e5f3ff; font-weight: 800; }.presence-disclaimer p { margin: 0; line-height: 1.5; }.presence-disclaimer strong { color: #365c79; }
.blank-state { display: grid; min-height: 270px; align-content: center; justify-items: center; padding: 24px; border: 1px solid #deebf7; border-radius: 17px; background: white; text-align: center; }.empty-icon { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 13px; color: #4788bf; background: #eaf5ff; font-size: 11px; font-weight: 850; }.blank-state h3 { margin: 13px 0 0; color: #315878; font-size: 15px; }.blank-state p { max-width: 420px; margin: 7px 0 0; color: #8195a8; font-size: 12px; line-height: 1.6; }
.patient-layout { display: grid; grid-template-columns: minmax(250px, .8fr) minmax(0, 1.4fr); align-items: start; gap: 16px; }.patient-list { display: grid; gap: 8px; }.patient-card, .patient-detail { border: 1px solid #deebf7; border-radius: 15px; background: #fff; box-shadow: 0 12px 30px #1d51820a; }.patient-card { display: grid; grid-template-columns: 36px minmax(0, 1fr) 12px; align-items: center; gap: 0 10px; padding: 13px; color: #254765; text-align: left; cursor: pointer; }.patient-card:hover, .patient-card.selected { border-color: #92c9f1; background: #f8fcff; }.patient-avatar { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 50%; color: #2368a4; background: #e8f4ff; font-weight: 800; }.patient-identity { display: grid; min-width: 0; gap: 4px; }.patient-identity strong { overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }.patient-identity small { overflow: hidden; color: #8ba0b2; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }.patient-card-arrow { color: #88a3b8; font-size: 19px; }.condition { grid-column: 2 / 4; overflow: hidden; margin-top: 7px; color: #8195a8; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.patient-detail { padding: 21px; }.detail-heading { display: flex; align-items: center; gap: 13px; padding-bottom: 18px; border-bottom: 1px solid #eef3f8; }.patient-avatar.large { width: 48px; height: 48px; font-size: 17px; }.detail-heading .eyebrow { margin-bottom: 4px; }.detail-heading h3 { margin: 0; color: #214c70; font-size: 17px; }.detail-heading div > span { display: block; margin-top: 4px; color: #8498aa; font-size: 11px; }.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 17px 14px; padding: 20px 0; }.detail-grid > div { display: grid; gap: 6px; }.detail-grid small, .detail-footer small { color: #8298aa; font-size: 10px; }.detail-grid strong { color: #365a77; font-size: 11px; font-weight: 650; line-height: 1.5; }.detail-grid .wide { grid-column: 1 / -1; }.detail-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px; border-radius: 12px; background: #f5faff; }.detail-footer > div { display: grid; gap: 4px; }.detail-footer strong { color: #1b629e; font-size: 18px; }.unavailable { display: flex; align-items: center; gap: 6px; color: #8498aa; font-size: 10px; }.unavailable i { width: 7px; height: 7px; border-radius: 50%; background: #b7c4ce; }
@media (max-width: 780px) { .patient-layout { grid-template-columns: 1fr; }.patient-list { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 540px) { .page-intro { align-items: stretch; flex-direction: column; }.search-box { width: 100%; }.patient-list { grid-template-columns: 1fr; }.patient-detail { padding: 16px; }.detail-grid { gap: 14px 8px; }.detail-footer { align-items: flex-start; flex-direction: column; } }
</style>
