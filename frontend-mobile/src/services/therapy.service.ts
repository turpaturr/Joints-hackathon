import { request } from './api';

export interface Movement {
  id: string;
  namaGerakan?: string;
  nama?: string;
  deskripsi?: string | null;
  instruksi?: string | null;
  mediaUrl?: string | null;
  mediaType?: string | null;
  imageBase64?: string | null;
  imageMimeType?: string | null;
  youtubeUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MovementPayload {
  namaGerakan?: string;
  nama?: string;
  deskripsi?: string;
  instruksi?: string;
  imageBase64?: string;
  imageMimeType?: string;
  youtubeUrl?: string;
}

export interface PrescriptionMovement {
  movementId: string;
  repetisi: number;
  durasiDetik: number;
}

export interface PrescriptionPayload {
  patientId: string;
  movements?: PrescriptionMovement[];
  movementId?: string;
  targetRepetisi?: number;
  frekuensiPerHari?: number;
  tanggalMulai?: string;
  tanggalBerakhir?: string;
  catatan?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  nakesId: string;
  movementId?: string;
  targetRepetisi?: number;
  frekuensiPerHari?: number;
  tanggalMulai?: string;
  tanggalBerakhir?: string;
  catatan?: string;
  createdAt?: string;
  updatedAt?: string;
  movement?: Movement;
  movements?: {
    movement: Movement;
    repetisi: number;
    durasiDetik: number;
  }[];
}

export type TherapyType = 'GYROSCOPE' | 'CAMERA';

export interface TherapySessionPayload {
  programName: string;
  therapyType: TherapyType;
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

/** Calculate therapy progress dynamically based on start date and end date */
export interface TherapyProgressInfo {
  currentDay: number;
  totalDays: number;
  percent: number;
  isStarted: boolean;
  isCompleted: boolean;
  dateRangeLabel: string;
}

export function calculateTherapyProgress(
  tanggalMulaiStr?: string | null,
  tanggalBerakhirStr?: string | null,
): TherapyProgressInfo {
  if (!tanggalMulaiStr || !tanggalBerakhirStr) {
    return {
      currentDay: 1,
      totalDays: 1,
      percent: 0,
      isStarted: false,
      isCompleted: false,
      dateRangeLabel: '',
    };
  }

  const start = new Date(tanggalMulaiStr);
  const end = new Date(tanggalBerakhirStr);
  const now = new Date();

  // Normalize to local midnight
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.round((endMidnight - startMidnight) / MS_PER_DAY) + 1);

  let currentDay = 1;
  let percent = 0;
  let isStarted = true;
  let isCompleted = false;

  if (todayMidnight < startMidnight) {
    currentDay = 0;
    percent = 0;
    isStarted = false;
  } else if (todayMidnight > endMidnight) {
    currentDay = totalDays;
    percent = 100;
    isCompleted = true;
  } else {
    // Current day increments daily as date advances
    currentDay = Math.min(totalDays, Math.round((todayMidnight - startMidnight) / MS_PER_DAY) + 1);
    percent = Math.min(100, Math.round((currentDay / totalDays) * 100));
  }

  const startFormatted = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  const endFormatted = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const dateRangeLabel = `${startFormatted} – ${endFormatted}`;

  return {
    currentDay,
    totalDays,
    percent,
    isStarted,
    isCompleted,
    dateRangeLabel,
  };
}

/** Helper to extract instructions as clean numbered steps */
export function parseInstructionSteps(instructionText?: string | null): string[] {
  if (!instructionText || !instructionText.trim()) {
    return [
      'Posisikan tubuh dengan tegak dan nyaman.',
      'Lakukan gerakan perlahan mengikuti petunjuk dokter.',
      'Tahan posisi selama beberapa detik, lalu rileks.',
    ];
  }

  const lines = instructionText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return lines.map((line) => line.replace(/^(\d+[\.\)\-:]\s*|Langkah\s*\d+[\.\)\-:]\s*|[-*•]\s*)/i, '').trim());
  }

  // If single line with numbered segments like "1. ... 2. ..."
  const splitSteps = instructionText.split(/(?=\d+[\.\)])/).map((s) => s.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean);
  if (splitSteps.length > 1) {
    return splitSteps;
  }

  return [instructionText.trim()];
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

/** GET /api/therapy-sessions/my — PATIENT views own sessions */
export async function getMyTherapySessions(
  token: string,
): Promise<TherapySession[]> {
  const res = await request<TherapySession[]>('/api/therapy-sessions/my', {
    token,
  });
  return res.data;
}

/** GET /api/therapy-sessions/my-prescriptions — PATIENT views own prescriptions */
export async function getMyPrescriptions(
  token: string,
): Promise<Prescription[]> {
  const res = await request<Prescription[]>(
    '/api/therapy-sessions/my-prescriptions',
    { token },
  );
  return res.data;
}
