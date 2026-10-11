import { request } from './api';

export interface PatientConnectionStatus {
  connected: boolean;
  nakes: {
    namaLengkap: string;
    email?: string | null;
    nomorTelepon?: string | null;
    spesialisasi?: string | null;
    faskes?: string | null;
    nomorRegis?: string | null;
    user?: { email?: string | null } | null;
    nakesProfile?: {
      spesialisasi?: string | null;
      faskes?: string | null;
      nomorRegis?: string | null;
      nomorTelepon?: string | null;
    } | null;
  } | null;
}

export interface PatientConnectionCode {
  code: string;
  expiresAt: string;
}

export async function getPatientConnectionStatus(
  token: string,
): Promise<PatientConnectionStatus> {
  const response = await request<PatientConnectionStatus>(
    '/api/connections/status',
    { token },
  );
  return response.data;
}

export async function createPatientConnectionCode(
  token: string,
): Promise<PatientConnectionCode> {
  const response = await request<PatientConnectionCode>(
    '/api/connections/code',
    { method: 'POST', token },
  );
  return response.data;
}
