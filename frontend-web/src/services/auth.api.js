import { apiRequest } from './api';

export async function loginUser(payload) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function registerUser(payload) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function getCurrentUser(token) {
  return apiRequest('/api/auth/me', { token });
}

export async function changePassword(payload, token) {
  return apiRequest('/api/auth/password', {
    method: 'PATCH',
    body: payload,
    token,
  });
}

export function saveSession(session) {
  localStorage.setItem('joints_session', JSON.stringify(session));
}

export function getSession() {
  try {
    const raw = localStorage.getItem('joints_session');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem('joints_session');
}
