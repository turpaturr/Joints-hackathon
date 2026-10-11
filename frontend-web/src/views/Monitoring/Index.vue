<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { monitoringData, refreshMonitoringData } from '../../composables/useMonitoringData'
import { getSession } from '../../services/auth.api'

const router = useRouter()
const token = getSession()?.token
const todaySessions = computed(() => {
  const today = new Date().toDateString()
  return monitoringData.sessions.filter((item) => new Date(item.performedAt).toDateString() === today).length
})
const cards = computed(() => [
  { label: 'Assigned patients', value: monitoringData.patients.length, detail: 'Linked to your care team', tone: 'blue' },
  { label: 'Therapy movements', value: monitoringData.movements.length, detail: 'Available in movement library', tone: 'cyan' },
  { label: 'Active prescriptions', value: monitoringData.prescriptions.filter((item) => Date.parse(item.tanggalMulai) <= Date.now() && Date.parse(item.tanggalBerakhir) >= Date.now()).length, detail: `${monitoringData.prescriptions.length} total patient plans`, tone: 'green' },
  { label: 'Sessions today', value: todaySessions.value, detail: 'Patient-submitted session logs', tone: 'violet' },
])

function refresh() {
  return refreshMonitoringData(token)
}
</script>

<template>
  <div class="overview-page">
    <section class="welcome-card">
      <div>
        <p class="eyebrow">CARE OVERVIEW</p>
        <h2>Patient recovery, at a glance.</h2>
        <p>Review your assigned patients, therapy plans, and submitted sessions in one place.</p>
      </div>
      <button class="primary-button" :disabled="monitoringData.loading" @click="refresh">
        {{ monitoringData.loading ? 'Refreshing…' : 'Refresh data' }}
      </button>
    </section>

    <div class="info-banner">
      <span class="info-dot">i</span>
      <p><strong>Patient online status is not available yet.</strong> The backend does not currently expose presence or last-seen data.</p>
    </div>

    <section class="stat-grid" aria-label="Monitoring summary">
      <article v-for="card in cards" :key="card.label" class="stat-card">
        <span :class="['stat-icon', card.tone]">{{ card.label.slice(0, 1) }}</span>
        <p>{{ card.label }}</p>
        <strong>{{ card.value }}</strong>
        <small>{{ card.detail }}</small>
      </article>
    </section>

    <section class="content-card">
      <header class="section-header">
        <div>
          <p class="eyebrow">YOUR CARE TEAM</p>
          <h2>Patients</h2>
        </div>
        <RouterLink class="text-link" :to="{ name: 'monitoring-patients' }">View all <span>→</span></RouterLink>
      </header>

      <div v-if="monitoringData.loading && !monitoringData.patients.length" class="empty-state">
        <span class="loader"></span><p>Loading patients from the backend…</p>
      </div>
      <div v-else-if="!monitoringData.patients.length" class="empty-state">
        <span class="empty-icon">PT</span>
        <h3>No assigned patients yet</h3>
        <p>Patients appear here after their profile is linked to your nakes account.</p>
      </div>
      <div v-else class="patient-table">
        <div class="table-head"><span>Patient</span><span>Condition</span><span>Sessions</span><span>Presence</span><span></span></div>
        <button
          v-for="patient in monitoringData.patients.slice(0, 5)"
          :key="patient.id"
          class="patient-row"
          @click="router.push({ name: 'monitoring-patients', query: { patient: patient.id } })"
        >
          <span class="patient-name"><span class="patient-avatar">{{ patient.namaLengkap?.slice(0, 1) || 'P' }}</span><span><strong>{{ patient.namaLengkap }}</strong><small>{{ patient.user?.email || 'Email not provided' }}</small></span></span>
          <span>{{ patient.kondisiMedis || 'Not specified' }}</span>
          <span>{{ patient._count?.therapySessions ?? 0 }}</span>
          <span class="presence"><i></i>Unavailable</span>
          <span class="row-arrow">→</span>
        </button>
        <div class="mobile-presence-note">Online status is not provided by the backend.</div>
      </div>
    </section>

    <section class="bottom-grid">
      <article class="content-card">
        <header class="section-header"><div><p class="eyebrow">RECENT ACTIVITY</p><h2>Therapy sessions</h2></div><RouterLink class="text-link" :to="{ name: 'monitoring-reports' }">See reports <span>→</span></RouterLink></header>
        <div v-if="monitoringData.sessions.length" class="activity-list">
          <div v-for="item in monitoringData.sessions.slice(0, 4)" :key="item.id" class="activity-row">
            <span class="activity-icon">↗</span>
            <div><strong>{{ item.programName }}</strong><small>{{ new Date(item.performedAt).toLocaleString() }}</small></div>
            <span>{{ item.validRepetitions }} reps</span>
          </div>
        </div>
        <div v-else class="compact-empty">No therapy session logs have been submitted by your patients yet.</div>
      </article>
      <article class="content-card movement-card">
        <header class="section-header"><div><p class="eyebrow">THERAPY LIBRARY</p><h2>Movement catalog</h2></div><RouterLink class="text-link" :to="{ name: 'monitoring-therapy' }">Manage <span>→</span></RouterLink></header>
        <div v-if="monitoringData.movements.length" class="movement-list">
          <div v-for="item in monitoringData.movements.slice(0, 4)" :key="item.id" class="movement-row"><span class="movement-symbol">✳</span><span><strong>{{ item.namaGerakan }}</strong><small>{{ item.mediaType || 'Exercise' }}</small></span></div>
        </div>
        <div v-else class="compact-empty">No movement data returned by the backend.</div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.overview-page { display: grid; gap: 20px; }
.welcome-card { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: clamp(20px, 3vw, 30px); border: 1px solid #d3e8fb; border-radius: 20px; background: linear-gradient(112deg, #d9edff, #f6fbff); }
.eyebrow { margin: 0 0 8px; color: #3685c5; font-size: 9px; font-weight: 850; letter-spacing: .14em; }
.welcome-card h2 { margin: 0; color: #164c83; font-size: clamp(20px, 3vw, 27px); letter-spacing: -.035em; }
.welcome-card p:not(.eyebrow) { max-width: 590px; margin: 8px 0 0; color: #627c93; font-size: 13px; line-height: 1.6; }
.primary-button { min-height: 40px; padding: 0 16px; border: 0; border-radius: 10px; color: white; background: linear-gradient(110deg, #2196f3, #0d47a1); box-shadow: 0 8px 18px #1b72be28; font-weight: 700; cursor: pointer; white-space: nowrap; }
.primary-button:disabled { opacity: .65; cursor: progress; }
.info-banner { display: flex; align-items: center; gap: 11px; padding: 12px 15px; border: 1px solid #d8e9f6; border-radius: 13px; color: #577188; background: #f8fcff; font-size: 12px; }
.info-banner p { margin: 0; line-height: 1.5; }.info-banner strong { color: #315a7b; }
.info-dot { display: grid; width: 22px; height: 22px; flex: 0 0 22px; place-items: center; border-radius: 50%; color: #2477b7; background: #e4f3ff; font-size: 12px; font-weight: 800; }
.stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.stat-card, .content-card { border: 1px solid #deebf7; border-radius: 17px; background: #fff; box-shadow: 0 12px 30px #1d51820a; }
.stat-card { position: relative; min-height: 148px; padding: 18px; }
.stat-icon { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 9px; font-size: 11px; font-weight: 850; }
.stat-icon.blue { color: #1977c3; background: #e6f4ff; }.stat-icon.cyan { color: #11879a; background: #e2f8fa; }.stat-icon.green { color: #27875c; background: #e8f8ef; }.stat-icon.violet { color: #6a66bb; background: #f0efff; }
.stat-card p { margin: 13px 0 3px; color: #6e8497; font-size: 11px; }.stat-card strong { display: block; color: #153f6c; font-size: 27px; line-height: 1.15; }.stat-card small { display: block; margin-top: 5px; color: #8aa0b2; font-size: 10px; }
.content-card { min-width: 0; padding: 20px; }
.section-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }.section-header .eyebrow { margin-bottom: 5px; }.section-header h2 { margin: 0; color: #193f64; font-size: 17px; }
.text-link { color: #2379bd; font-size: 11px; font-weight: 750; text-decoration: none; white-space: nowrap; }.text-link span { margin-left: 4px; font-size: 15px; }
.empty-state { display: grid; min-height: 160px; align-content: center; justify-items: center; padding: 18px; text-align: center; }.empty-state p, .compact-empty { margin: 7px 0 0; color: #8195a8; font-size: 12px; line-height: 1.5; }.empty-state h3 { margin: 12px 0 0; color: #315878; font-size: 14px; }.empty-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 13px; color: #4788bf; background: #eaf5ff; font-size: 11px; font-weight: 850; }
.loader { width: 23px; height: 23px; border: 2px solid #cce5f8; border-top-color: #2196f3; border-radius: 50%; animation: spin .8s linear infinite; }@keyframes spin { to { transform: rotate(360deg); } }
.patient-table { display: grid; }.table-head, .patient-row { display: grid; grid-template-columns: 1.5fr 1.2fr .55fr .7fr 20px; align-items: center; gap: 12px; }.table-head { padding: 0 10px 10px; border-bottom: 1px solid #edf2f7; color: #8a9eaf; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; }.patient-row { width: 100%; padding: 11px 10px; border: 0; border-bottom: 1px solid #f0f4f8; color: #536b80; background: transparent; text-align: left; font-size: 11px; cursor: pointer; }.patient-row:hover { background: #f7fbff; }.patient-name { display: flex; min-width: 0; align-items: center; gap: 9px; }.patient-avatar { display: grid; width: 32px; height: 32px; flex: 0 0 32px; place-items: center; border-radius: 50%; color: #2368a4; background: #e8f4ff; font-weight: 800; }.patient-name > span:last-child { display: grid; min-width: 0; gap: 3px; }.patient-name strong { overflow: hidden; color: #294f70; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }.patient-name small, .movement-row small, .activity-row small { overflow: hidden; color: #93a5b5; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }.presence { display: flex; align-items: center; gap: 5px; font-size: 10px; }.presence i { width: 7px; height: 7px; border-radius: 50%; background: #b7c4ce; }.row-arrow { color: #7d9bb3; font-size: 15px; }.mobile-presence-note { display: none; }
.bottom-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 16px; }.activity-list, .movement-list { display: grid; }.activity-row, .movement-row { display: flex; align-items: center; gap: 11px; min-height: 52px; border-bottom: 1px solid #f0f4f8; }.activity-row > div, .movement-row > span:nth-child(2) { display: grid; flex: 1; gap: 4px; }.activity-row strong, .movement-row strong { color: #335b7b; font-size: 11px; }.activity-row > span:last-child { color: #3474a4; font-size: 10px; font-weight: 700; }.activity-icon, .movement-symbol { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 10px; color: #2884c6; background: #e8f5ff; font-weight: 800; }.movement-symbol { color: #488f77; background: #e8f7f0; }.compact-empty { padding: 18px 0; }
@media (max-width: 1000px) { .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }.bottom-grid { grid-template-columns: 1fr; } }
@media (max-width: 650px) { .welcome-card { align-items: flex-start; flex-direction: column; }.stat-grid { gap: 9px; }.stat-card { min-height: 135px; padding: 14px; }.stat-card strong { font-size: 24px; }.content-card { padding: 16px; }.table-head { display: none; }.patient-row { grid-template-columns: 1fr auto; gap: 4px 8px; padding: 12px 4px; }.patient-row > span:nth-child(2) { grid-column: 1; padding-left: 41px; font-size: 10px; }.patient-row > span:nth-child(3) { grid-column: 2; grid-row: 1; }.patient-row > span:nth-child(4) { display: none; }.patient-row > span:nth-child(5) { grid-column: 2; grid-row: 2; }.mobile-presence-note { display: block; padding-top: 12px; color: #879bad; font-size: 10px; }.info-banner { align-items: flex-start; } }
</style>
