/**
 * Base API client for the Joints backend.
 * Reads the base URL from the EXPO_PUBLIC_API_URL env variable.
 */

import Constants from 'expo-constants';

const host = Constants.expoConfig?.hostUri?.split(':')[0];
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (host ? `http://${host}:3000` : 'http://192.168.1.3:3000');

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${path}`;
  console.log(`[API] ${method} ${url}`);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    console.error('[API] Network error:', networkError);
    throw new ApiError(0, 'Tidak dapat terhubung ke server.');
  }

  console.log(`[API] ${method} ${url} → ${res.status}`);

  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    console.error(`[API] Non-JSON response (${res.status}):`, text.slice(0, 300));
    throw new ApiError(
      res.status,
      `Server mengembalikan respons tidak valid (HTTP ${res.status})`,
    );
  }

  if (!res.ok) {
    console.warn('[API] Error body:', json);
    const message =
      typeof json === 'object' &&
      json !== null &&
      'message' in json &&
      typeof json.message === 'string'
        ? json.message
        : res.statusText;
    throw new ApiError(res.status, message, json);
  }

  return json as ApiResponse<T>;
}
