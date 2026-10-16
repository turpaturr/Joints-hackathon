import { Platform } from 'react-native';
import { request } from './api';

export interface PatientProfileData {
  namaLengkap: string;
  email: string;
  role: string;
  faskes?: string | null;
  dokterPendamping?: string | null;
  nomorTelepon: string;
  alamat: string;
}

const PROFILE_STORAGE_PREFIX = 'joints_patient_profile_extra_';

async function storageGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  }
  try {
    const { getItemAsync } = await import('expo-secure-store');
    return await getItemAsync(key);
  } catch {
    return null;
  }
}

async function storageSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return;
  }
  try {
    const { setItemAsync } = await import('expo-secure-store');
    await setItemAsync(key, value);
  } catch (err) {
    console.warn('[patientProfileService] Failed to persist:', err);
  }
}

export async function getPatientFullProfile(
  userId: string,
  token: string,
): Promise<PatientProfileData> {
  let meData: any = null;
  let connectionData: any = null;

  try {
    const meRes = await request<any>('/api/auth/me', { token });
    meData = meRes.data;
  } catch (err) {
    console.warn('[patientProfileService] Failed to fetch /api/auth/me:', err);
  }

  try {
    const connRes = await request<any>('/api/connections/status', { token });
    connectionData = connRes.data;
  } catch (err) {
    console.warn('[patientProfileService] Failed to fetch /api/connections/status:', err);
  }

  // Load custom phone and address stored locally for this user
  let localExtra: { nomorTelepon?: string; alamat?: string } = {};
  try {
    const raw = await storageGet(`${PROFILE_STORAGE_PREFIX}${userId}`);
    if (raw) {
      localExtra = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[patientProfileService] Failed to load local profile extra:', err);
  }

  const namaLengkap =
    meData?.patientProfile?.namaLengkap ||
    meData?.namaLengkap ||
    meData?.email?.split('@')[0] ||
    'Pasien';

  const email = meData?.email || 'Email tidak tersedia';
  const role = meData?.role === 'PATIENT' ? 'Pasien' : meData?.role || 'Pasien';

  const nakes = connectionData?.nakes;
  const dokterPendamping = nakes?.namaLengkap || nakes?.nakesProfile?.namaLengkap || null;
  const faskes = nakes?.faskes || nakes?.nakesProfile?.faskes || null;

  return {
    namaLengkap,
    email,
    role,
    dokterPendamping,
    faskes,
    nomorTelepon: localExtra.nomorTelepon || '',
    alamat: localExtra.alamat || '',
  };
}

export async function savePatientEditableProfile(
  userId: string,
  data: { nomorTelepon: string; alamat: string },
): Promise<void> {
  await storageSet(
    `${PROFILE_STORAGE_PREFIX}${userId}`,
    JSON.stringify({
      nomorTelepon: data.nomorTelepon.trim(),
      alamat: data.alamat.trim(),
    }),
  );
}
