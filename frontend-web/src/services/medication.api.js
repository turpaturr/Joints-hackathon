import { apiRequest } from './api'

export async function createMedicationSchedule(payload, token) {
  return apiRequest('/api/medications/schedules', {
    method: 'POST',
    body: payload,
    token,
  })
}
