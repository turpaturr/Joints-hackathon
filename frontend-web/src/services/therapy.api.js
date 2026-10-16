import { apiRequest } from './api';

export async function getMovements(token) {
  return apiRequest('/api/therapy/movements', {
    method: 'GET',
    token,
  });
}

export async function createMovement(payload, token) {
  return apiRequest('/api/therapy/movements', {
    method: 'POST',
    body: payload,
    token,
  });
}

export async function updateMovement(movementId, payload, token) {
  return apiRequest(`/api/therapy/movements/${encodeURIComponent(movementId)}`, {
    method: 'PATCH',
    body: payload,
    token,
  });
}

export async function deleteMovement(movementId, token) {
  return apiRequest(`/api/therapy/movements/${encodeURIComponent(movementId)}`, {
    method: 'DELETE',
    token,
  });
}

export async function createPrescription(payload, token) {
  return apiRequest('/api/therapy/prescriptions', {
    method: 'POST',
    body: payload,
    token,
  });
}

export async function updatePrescription(prescriptionId, payload, token) {
  return apiRequest(`/api/therapy/prescriptions/${encodeURIComponent(prescriptionId)}`, {
    method: 'PATCH',
    body: payload,
    token,
  });
}

export async function deletePrescription(prescriptionId, token) {
  return apiRequest(`/api/therapy/prescriptions/${encodeURIComponent(prescriptionId)}`, {
    method: 'DELETE',
    token,
  });
}

export async function getPatientPrescriptions(patientId, token) {
  return apiRequest(`/api/therapy/prescriptions/patient/${patientId}`, {
    method: 'GET',
    token,
  });
}

export async function createTherapySession(payload, token) {
  return apiRequest('/api/therapy-sessions', {
    method: 'POST',
    body: payload,
    token,
  });
}
