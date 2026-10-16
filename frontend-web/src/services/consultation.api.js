import { apiRequest } from './api'

export async function getConsultations(token) {
  return apiRequest('/api/consultations', { token })
}

export async function getConsultation(consultationId, token) {
  return apiRequest(`/api/consultations/${encodeURIComponent(consultationId)}`, { token })
}

export async function respondToConsultation(consultationId, response, token) {
  return apiRequest(`/api/consultations/${encodeURIComponent(consultationId)}/responses`, {
    method: 'POST',
    body: { response },
    token,
  })
}

export async function updateConsultationStatus(consultationId, status, token) {
  return apiRequest(`/api/consultations/${encodeURIComponent(consultationId)}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  })
}
