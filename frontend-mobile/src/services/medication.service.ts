import { request } from './api';

export interface MedicationSchedule {
  id: string;
  patientId: string;
  nakesId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  timeToTake: string[];
  startDate: string;
  endDate: string;
  logs: MedicationLog[];
}

export interface MedicationLog {
  id: string;
  scheduleId: string;
  patientId: string;
  status: string;
  takenAt: string;
}

/** GET /api/medications/schedules — PATIENT only */
export async function getPatientMedicationSchedules(
  token: string,
): Promise<MedicationSchedule[]> {
  const res = await request<MedicationSchedule[]>('/api/medications/schedules', {
    token,
  });
  return res.data;
}
