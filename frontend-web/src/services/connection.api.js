import { apiRequest } from './api'

export async function redeemPatientCode(code, token) {
  return apiRequest('/api/connections/redeem', {
    method: 'POST',
    body: { code },
    token,
  })
}
