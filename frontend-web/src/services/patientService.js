import { apiRequest } from './api'

export async function getNakesPatients(token) {
  return apiRequest('/api/therapy/patients', { token })
}

export async function getPatientSessions(patientId, token) {
  return apiRequest(`/api/therapy-sessions/patient/${encodeURIComponent(patientId)}`, {
    token,
  })
}