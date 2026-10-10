import { request } from './api';

export interface Movement {
  id: string;
  nama: string;
  deskripsi: string;
  createdAt: string;
}

export interface MovementPayload {
  nama: string;
  deskripsi?: string;
}

export interface PrescriptionMovement {
  movementId: string;
  repetisi: number;
  durasiDetik: number;
}

export interface PrescriptionPayload {
  patientId: string;
  movements: PrescriptionMovement[];
  catatan?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  nakesId: string;
  catatan?: string;
  createdAt: string;
  movements: {
    movement: Movement;
    repetisi: number;
    durasiDetik: number;
  }[];
}

export interface TherapySessionPayload {
  programName: string;
  estimatedAngle: number;
  validRepetitions: number;
  durationMs: number;
  sampleCount: number;
  performedAt: string;
  prescriptionId?: string;
}

export interface TherapySession extends TherapySessionPayload {
  id: string;
  patientId: string;
  createdAt: string;
}

/** POST /api/therapy-sessions — PATIENT only */
export async function createTherapySession(
  payload: TherapySessionPayload,
  token: string,
): Promise<TherapySession> {
  const res = await request<TherapySession>('/api/therapy-sessions', {
    method: 'POST',
    body: payload,
    token,
  });
  return res.data;
}

/** GET /api/therapy/movements — requires auth token */
export async function listMovements(token: string): Promise<Movement[]> {
  const res = await request<Movement[]>('/api/therapy/movements', { token });
  return res.data;
}

/** POST /api/therapy/movements — NAKES only */
export async function addMovement(
  payload: MovementPayload,
  token: string,
): Promise<Movement> {
  const res = await request<Movement>('/api/therapy/movements', {
    method: 'POST',
    body: payload,
    token,
  });
  return res.data;
}

/** POST /api/therapy/prescriptions — NAKES only */
export async function addPrescription(
  payload: PrescriptionPayload,
  token: string,
): Promise<Prescription> {
  const res = await request<Prescription>('/api/therapy/prescriptions', {
    method: 'POST',
    body: payload,
    token,
  });
  return res.data;
}

/** GET /api/therapy/prescriptions/patient/:patientId */
export async function getPatientPrescriptions(
  patientId: string,
  token: string,
): Promise<Prescription[]> {
  const res = await request<Prescription[]>(
    `/api/therapy/prescriptions/patient/${patientId}`,
    { token },
  );
  return res.data;
}
