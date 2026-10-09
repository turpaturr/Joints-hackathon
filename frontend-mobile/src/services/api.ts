/**
 * Base API client for the Joints backend.
 * Reads the base URL from the EXPO_PUBLIC_API_URL env variable.
 */

//const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.11.99.10:3000'; //kalau mau tes di expo go ganti ke ip masing masing komputer

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
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${path}`;
  console.log(`[API] ${method} ${url}`);

  // ── Network request ─────────────────────────────────────────────────────
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    console.error(`[API] Network error:`, networkError);
    throw new ApiError(
      0,
      'Tidak dapat terhubung ke server.',
    );
  }

  console.log(`[API] ${method} ${url} → ${res.status}`);

  // ── Parse response body ──────────────────────────────────────────────────
  // The server might occasionally return HTML (e.g. proxy errors), so we
  // read as text first and only then try JSON.parse.
  const text = await res.text();
  let json: any;
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
    console.warn(`[API] Error body:`, json);
    throw new ApiError(res.status, json?.message ?? res.statusText, json);
  }

  return json as ApiResponse<T>;
}
