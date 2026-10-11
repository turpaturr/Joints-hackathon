<script setup>
import { computed, ref } from 'vue'
import { monitoringData } from '../../composables/useMonitoringData'

const patientFilter = ref('')
const filteredSessions = computed(() => {
  return monitoringData.sessions
    .filter((session) => !patientFilter.value || session.patientId === patientFilter.value)
    .sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt))
})
const averageAngle = computed(() => {
  if (!filteredSessions.value.length) return '—'
  return `${Math.round(filteredSessions.value.reduce((sum, session) => sum + session.estimatedAngle, 0) / filteredSessions.value.length)}°`
})
const averageReps = computed(() => {
  if (!filteredSessions.value.length) return '—'
  return Math.round(filteredSessions.value.reduce((sum, session) => sum + session.validRepetitions, 0) / filteredSessions.value.length)
})
</script>

<template>
  <div class="reports-page">
    <header class="page-intro"><div><p class="eyebrow">CLINICAL INSIGHTS</p><h2>Reports</h2><p>Review exercise data submitted by your assigned patients.</p></div>
      <label class="filter">Patient<select v-model="patientFilter"><option value="">All patients</option><option v-for="patient in monitoringData.patients" :key="patient.id" :value="patient.id">{{ patient.namaLengkap }}</option></select></label>
    </header>

    <div class="metric-grid">
      <article class="metric-card"><span class="metric-icon blue">Σ</span><small>Session logs</small><strong>{{ filteredSessions.length }}</strong><span>Records received from patient devices</span></article>
      <article class="metric-card"><span class="metric-icon green">↗</span><small>Average valid repetitions</small><strong>{{ averageReps }}</strong><span>Across the selected session records</span></article>
      <article class="metric-card"><span class="metric-icon violet">∠</span><small>Average estimated angle</small><strong>{{ averageAngle }}</strong><span>Backend session estimate</span></article>
    </div>

    <section class="report-card">
      <header class="section-header"><div><p class="eyebrow">SESSION HISTORY</p><h3>Patient exercise sessions</h3></div><span class="count">{{ filteredSessions.length }} records</span></header>
      <div v-if="!filteredSessions.length" class="empty-state"><span class="empty-icon">RP</span><strong>No session data available</strong><p>Session history appears after the patient app submits therapy-session records. Presence and online/offline status are not part of these records.</p></div>
      <div v-else class="table-wrap">
        <table><thead><tr><th>Patient</th><th>Program</th><th>Valid reps</th><th>Angle</th><th>Duration</th><th>Recorded</th></tr></thead>
          <tbody><tr v-for="session in filteredSessions" :key="session.id"><td>{{ monitoringData.patients.find((patient) => patient.id === session.patientId)?.namaLengkap || 'Patient' }}</td><td>{{ session.programName }}</td><td>{{ session.validRepetitions }}</td><td>{{ session.estimatedAngle }}°</td><td>{{ (session.durationMs / 1000).toFixed(1) }} sec</td><td>{{ new Date(session.performedAt).toLocaleString() }}</td></tr></tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.reports-page { display: grid; gap: 18px; }.page-intro, .section-header { display: flex; align-items: end; justify-content: space-between; gap: 16px; }.eyebrow { margin: 0 0 6px; color: #3983bb; font-size: 9px; font-weight: 850; letter-spacing: .14em; }.page-intro h2 { margin: 0; color: #174773; font-size: 25px; }.page-intro p:not(.eyebrow) { margin: 7px 0 0; color: #758da1; font-size: 12px; }.filter { display: grid; gap: 5px; color: #678197; font-size: 10px; font-weight: 700; }.filter select { min-width: 180px; height: 39px; padding: 0 10px; border: 1px solid #dbeaf6; border-radius: 10px; color: #315875; background: #fff; font: inherit; font-size: 11px; }.metric-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 13px; }.metric-card, .report-card { border: 1px solid #deebf7; border-radius: 16px; background: white; box-shadow: 0 12px 30px #1d51820a; }.metric-card { display: grid; justify-items: start; min-height: 150px; padding: 17px; }.metric-icon, .empty-icon { display: grid; width: 31px; height: 31px; place-items: center; border-radius: 10px; font-weight: 800; }.metric-icon.blue { color: #247cc0; background: #e9f5ff; }.metric-icon.green { color: #37845e; background: #eaf8f1; }.metric-icon.violet { color: #6a66bb; background: #f0efff; }.metric-card small { margin-top: 12px; color: #8195a7; font-size: 10px; }.metric-card strong { margin: 3px 0; color: #1a4c79; font-size: 26px; }.metric-card > span:last-child { color: #94a5b3; font-size: 9px; }.report-card { min-width: 0; padding: 20px; }.section-header { align-items: center; margin-bottom: 14px; }.section-header .eyebrow { margin-bottom: 4px; }.section-header h3 { margin: 0; color: #234b6d; font-size: 15px; }.count { color: #8499aa; font-size: 10px; }.empty-state { display: grid; min-height: 190px; align-content: center; justify-items: center; text-align: center; }.empty-icon { color: #4487b5; background: #eaf5ff; font-size: 9px; }.empty-state strong { margin-top: 11px; color: #476783; font-size: 12px; }.empty-state p { max-width: 440px; margin: 6px 0 0; color: #899cad; font-size: 10px; line-height: 1.6; }.table-wrap { overflow: auto; }table { width: 100%; border-collapse: collapse; text-align: left; white-space: nowrap; }th { padding: 10px; color: #8498a9; font-size: 9px; text-transform: uppercase; letter-spacing: .06em; }td { padding: 12px 10px; border-top: 1px solid #eff3f7; color: #49657d; font-size: 10px; }
@media (max-width: 700px) { .metric-grid { grid-template-columns: 1fr 1fr; }.page-intro { align-items: flex-start; flex-direction: column; }.filter, .filter select { width: 100%; }.metric-card:last-child { grid-column: 1 / -1; } }
@media (max-width: 420px) { .metric-grid { grid-template-columns: 1fr; }.metric-card:last-child { grid-column: auto; } }
</style>
