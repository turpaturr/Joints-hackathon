import { apiRequest } from './api'

export async function getNakesPatients(token) {
  return apiRequest('/api/therapy/patients', { token })
}

export async function updatePatientClinicalData(patientId, patientData, token) {
  return apiRequest(`/api/connections/patients/${encodeURIComponent(patientId)}/clinical`, {
    method: 'PATCH',
    body: patientData,
    token,
  })
}

export async function getPatientSessions(patientId, token) {
  return apiRequest(`/api/therapy-sessions/patient/${encodeURIComponent(patientId)}`, {
    token,
  })
}