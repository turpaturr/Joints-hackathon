import { ApiError } from '@/services/api';
import {
  createPatientConnectionCode,
  getPatientConnectionStatus,
  type PatientConnectionStatus,
} from '@/services/connection.service';
import { authStore } from '@/services/AuthServices/authStore';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function usePatientConnection(isPatient: boolean) {
  const [status, setStatus] = useState<PatientConnectionStatus | null>(null);
  const [code, setCode] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [now, setNow] = useState(0);
  const [loading, setLoading] = useState(Boolean(authStore.token && isPatient));
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(
    isPatient && !authStore.token
      ? 'Sesi login tidak ditemukan. Silakan masuk kembali.'
      : '',
  );

  const secondsRemaining = useMemo(
    () =>
      expiresAt
        ? Math.max(0, Math.ceil((Date.parse(expiresAt) - now) / 1000))
        : 0,
    [expiresAt, now],
  );

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = authStore.token;
    if (!token || !isPatient) return;

    let isActive = true;

    const loadConnection = async () => {
      try {
        const connection = await getPatientConnectionStatus(token);
        if (!isActive) return;
        setStatus(connection);

        if (!connection.connected) {
          setGenerating(true);
          const result = await createPatientConnectionCode(token);
          if (isActive) {
            setCode(result.code);
            setExpiresAt(result.expiresAt);
            setNow(Date.now());
          }
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : 'Status koneksi gagal dimuat. Coba lagi.',
          );
        }
      } finally {
        if (isActive) {
          setGenerating(false);
          setLoading(false);
        }
      }
    };

    void loadConnection();
    return () => {
      isActive = false;
    };
  }, [isPatient]);

  const refreshStatus = useCallback(async () => {
    const token = authStore.token;
    if (!token) {
      setError('Sesi login tidak ditemukan. Silakan masuk kembali.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const connection = await getPatientConnectionStatus(token);
      setStatus(connection);
      if (!connection.connected && !code) {
        setGenerating(true);
        const result = await createPatientConnectionCode(token);
        setCode(result.code);
        setExpiresAt(result.expiresAt);
        setNow(Date.now());
      }
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Status koneksi gagal dimuat. Coba lagi.',
      );
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  }, [code]);

  return {
    status,
    code,
    secondsRemaining,
    loading,
    generating,
    error,
    refreshStatus,
  };
}
