import { request } from "../api";

export interface AuthUser {
  id: string;
  email: string;
  role: "PATIENT" | "NAKES";
  namaLengkap?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  namaLengkap: string;
  role: "PATIENT" | "NAKES";
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { ...payload, platform: "ANDROID" },
  });
  return res.data;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const res = await request<AuthUser>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
  return res.data;
}
