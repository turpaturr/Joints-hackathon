const DEFAULT_BASE_URL = 'http://localhost:3000';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, token, headers = {}, parseJson = true } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    config.body = JSON.stringify(body);
  } else if (body !== undefined && body !== null) {
    config.body = body;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config);

  const rawText = await response.text();
  let payload = rawText ? JSON.parse(rawText) : null;

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'Request failed';
    const validationDetails = payload?.error?.details;
    const details = Array.isArray(validationDetails)
      ? validationDetails
        .map((issue) => {
          const path = Array.isArray(issue?.path) ? issue.path.join('.') : ''
          return [path, issue?.message].filter(Boolean).join(': ')
        })
        .filter(Boolean)
      : [];
    throw new Error(details.length ? `${message}: ${details.join('; ')}` : message);
  }

  if (!parseJson) {
    return rawText;
  }

  return payload;
}

export { API_BASE_URL };
