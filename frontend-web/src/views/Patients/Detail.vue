<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import PatientGyroscopeChart from '../../components/patients/PatientGyroscopeChart.vue'
import PatientMovements from '../../components/patients/PatientMovements.vue'
import PatientProfileHeader from '../../components/patients/PatientProfileHeader.vue'
import PatientSummaryCards from '../../components/patients/PatientSummaryCards.vue'
import PatientTherapyHistory from '../../components/patients/PatientTherapyHistory.vue'
import PatientTherapyTasks from '../../components/patients/PatientTherapyTasks.vue'
import { monitoringData } from '../../composables/useMonitoringData'
import { demoPatient, demoSessions } from '../../data/patient-detail-demo'

const route = useRoute()
const selectedSessionId = ref(demoSessions[0].id)

const patient = computed(() => {
  const patientId = String(route.params.patientId)
  return monitoringData.patients.find((item) => item.id === patientId) || demoPatient
})
const isDemoPatient = computed(() => patient.value === demoPatient)
const selectedSession = computed(() =>
  demoSessions.find((session) => session.id === selectedSessionId.value) ?? demoSessions[0],
)
const displayName = computed(() => patient.value.namaLengkap || 'Pasien')
const patientInitials = computed(() =>
  displayName.value.split(/\s+/).slice(0, 2).map((name) => name[0]).join('').toUpperCase(),
)
const age = computed(() => {
  if (!patient.value.tanggalLahir) return null
  const birthDate = new Date(patient.value.tanggalLahir)
  const now = new Date()
  let years = now.getFullYear() - birthDate.getFullYear()
  if (
    now.getMonth() < birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())
  ) years -= 1
  return years
})
const gender = computed(() => ({
  LAKI_LAKI: 'Pria',
  PEREMPUAN: 'Wanita',
}[patient.value.jenisKelamin] || 'Tidak tersedia'))
const patientIdLabel = computed(() =>
  isDemoPatient.value ? 'DEMO-00842' : `JNT-${patient.value.id.slice(0, 8).toUpperCase()}`,
)

function formatDate(value, options = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat('id-ID', options).format(new Date(value))
}

function formatTime(value) {
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}
</script>

<template>
  <div class="space-y-5 sm:space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-sm text-muted">
        <RouterLink class="rounded-control transition hover:text-primary" :to="{ name: 'monitoring-patients' }">Pasien</RouterLink>
        <span aria-hidden="true">/</span>
        <span class="font-medium text-primary-dark">Detail pasien</span>
      </div>
      <span class="inline-flex items-center gap-2 rounded-full border border-warning/25 bg-warning/5 px-3 py-1.5 text-sm font-medium text-[#946a16]">
        <span class="size-1.5 rounded-full bg-warning" />
        {{ isDemoPatient ? 'Profil demo · data terapi dummy' : 'Data terapi dummy · placeholder' }}
      </span>
    </div>

    <PatientProfileHeader
      :name="displayName"
      :initials="patientInitials"
      :patient-id="patientIdLabel"
      :age="age"
      :gender="gender"
    />

    <PatientSummaryCards
      :patient="patient"
      :session="selectedSession"
      :format-date="formatDate"
      :format-time="formatTime"
    />

    <section class="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
      <PatientGyroscopeChart v-model="selectedSessionId" :sessions="demoSessions" />
      <PatientTherapyTasks />
    </section>

    <PatientMovements />
    <PatientTherapyHistory />

    <footer class="flex flex-wrap justify-between gap-2 px-1 pb-2 text-sm text-muted">
      <span>Informasi pasien hanya dapat diakses oleh tenaga kesehatan berwenang.</span>
      <span>{{ patient.nomorTelepon || 'Nomor telepon tidak tersedia' }} <span class="px-1 text-line">·</span> {{ patient.user?.email || 'Email tidak tersedia' }}</span>
    </footer>
  </div>
</template>
