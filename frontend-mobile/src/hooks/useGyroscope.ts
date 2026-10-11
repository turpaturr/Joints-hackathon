import { Gyroscope } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

export interface GyroSample {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

interface Options {
  enabled: boolean;
  /** Interval pembacaan sensor (ms). Default 100ms = 10Hz. */
  intervalMs?: number;
}

export function useGyroscope({ enabled, intervalMs = 100 }: Options) {
  const [latest, setLatest] = useState<Omit<GyroSample, 'timestamp'>>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [sampleCount, setSampleCount] = useState(0);
  const bufferRef = useRef<GyroSample[]>([]);
  const subscriptionRef = useRef<ReturnType<typeof Gyroscope.addListener> | null>(
    null
  );

  useEffect(() => {
    if (!enabled) return;

    Gyroscope.setUpdateInterval(intervalMs);
    subscriptionRef.current = Gyroscope.addListener(({ x, y, z }) => {
      const sample: GyroSample = { x, y, z, timestamp: Date.now() };
      bufferRef.current.push(sample);
      setLatest({ x, y, z });
      setSampleCount(bufferRef.current.length);
    });

    return () => {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
    };
  }, [enabled, intervalMs]);

  /** Ambil dan kosongkan buffer — dipanggil saat sesi selesai / kirim batch. */
  const flush = (): GyroSample[] => {
    const data = bufferRef.current;
    bufferRef.current = [];
    setSampleCount(0);
    return data;
  };

  const reset = () => {
    bufferRef.current = [];
    setSampleCount(0);
    setLatest({ x: 0, y: 0, z: 0 });
  };

  return { latest, sampleCount, flush, reset };
}