import { request } from './api';

export type ConsultationStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface Consultation {
  id: string;
  subject: string;
  description: string;
  location: string | null;
  painScale: number | null;
  symptomStartedAt: string | null;
  status: ConsultationStatus;
  response: string | null;
  resolvedAt: string | null;
  createdAt: string;
  nakes?: {
    namaLengkap: string;
    spesialisasi?: string | null;
    faskes?: string | null;
  };
}

export interface CreateConsultationPayload {
  subject: string;
  description: string;
  location?: string | null;
  painScale?: number | null;
  symptomStartedAt?: string | null;
}

export async function getConsultations(token: string): Promise<Consultation[]> {
  const response = await request<Consultation[]>('/api/consultations', { token });
  return response.data;
}

export async function getConsultation(
  consultationId: string,
  token: string,
): Promise<Consultation> {
  const response = await request<Consultation>(
    `/api/consultations/${encodeURIComponent(consultationId)}`,
    { token },
  );
  return response.data;
}

export async function createConsultation(
  payload: CreateConsultationPayload,
  token: string,
): Promise<Consultation> {
  const response = await request<Consultation>('/api/consultations', {
    method: 'POST',
    body: payload,
    token,
  });
  return response.data;
}
