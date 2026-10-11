import { reactive } from 'vue'
import { getNakesPatients, getPatientSessions } from '../services/patientService'
import { getMovements, getPatientPrescriptions } from '../services/therapy.api'

export const monitoringData = reactive({
  patients: [],
  movements: [],
  prescriptions: [],
  sessions: [],
  loading: false,
  error: '',
  refreshedAt: null,
})

function unwrap(response) {
  return response?.data ?? response ?? []
}

export async function refreshMonitoringData(token) {
  if (!token) {
    monitoringData.error = 'Sesi login tidak ditemukan. Silakan login kembali.'
    return
  }

  monitoringData.loading = true
  monitoringData.error = ''
  try {
    const [patientResponse, movementResponse] = await Promise.all([
      getNakesPatients(token),
      getMovements(token),
    ])
    const patients = unwrap(patientResponse)
    monitoringData.patients = Array.isArray(patients) ? patients : []
    monitoringData.movements = unwrap(movementResponse)

    const details = await Promise.all(
      monitoringData.patients.map(async (patient) => {
        const [prescriptionResponse, sessionResponse] = await Promise.all([
          getPatientPrescriptions(patient.id, token),
          getPatientSessions(patient.id, token),
        ])
        return {
          prescriptions: unwrap(prescriptionResponse),
          sessions: unwrap(sessionResponse),
        }
      }),
    )

    monitoringData.prescriptions = details.flatMap((item) => item.prescriptions)
    monitoringData.sessions = details.flatMap((item) => item.sessions)
    monitoringData.refreshedAt = new Date()
  } catch (error) {
    monitoringData.error = error?.message || 'Data monitoring gagal dimuat.'
  } finally {
    monitoringData.loading = false
  }
}
