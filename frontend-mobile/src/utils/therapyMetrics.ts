import type { GyroSample } from '@/hooks/useGyroscope';

const MAX_SAMPLE_GAP_MS = 500;
const REPETITION_PEAK_DEGREES = 30;
const REPETITION_RETURN_DEGREES = 10;

export interface TherapyMetrics {
  estimatedAngle: number;
  validRepetitions: number;
}

export function estimateTherapyMetrics(samples: GyroSample[]): TherapyMetrics {
  if (samples.length < 2) {
    return { estimatedAngle: 0, validRepetitions: 0 };
  }

  const orientation: { x: number; y: number; z: number }[] = [
    { x: 0, y: 0, z: 0 },
  ];

  for (let index = 1; index < samples.length; index += 1) {
    const previous = samples[index - 1];
    const current = samples[index];
    const deltaMs = current.timestamp - previous.timestamp;
    const lastOrientation = orientation[index - 1];

    if (deltaMs <= 0 || deltaMs > MAX_SAMPLE_GAP_MS) {
      orientation.push({ ...lastOrientation });
      continue;
    }

    const deltaSeconds = deltaMs / 1000;
    orientation.push({
      x: lastOrientation.x + ((previous.x + current.x) / 2) * deltaSeconds,
      y: lastOrientation.y + ((previous.y + current.y) / 2) * deltaSeconds,
      z: lastOrientation.z + ((previous.z + current.z) / 2) * deltaSeconds,
    });
  }

  const axes = ['x', 'y', 'z'] as const;
  const minimum = { x: Infinity, y: Infinity, z: Infinity };
  const maximum = { x: -Infinity, y: -Infinity, z: -Infinity };
  for (const sample of orientation) {
    for (const key of axes) {
      minimum[key] = Math.min(minimum[key], sample[key]);
      maximum[key] = Math.max(maximum[key], sample[key]);
    }
  }
  const axis = axes.reduce((selected, candidate) =>
    maximum[candidate] - minimum[candidate] >
    maximum[selected] - minimum[selected]
      ? candidate
      : selected,
  );

  let maximumExcursion = 0;
  let validRepetitions = 0;
  let reachedPeak = false;

  for (const sample of orientation) {
    const angleDegrees = (sample[axis] * 180) / Math.PI;
    const excursion = Math.abs(angleDegrees);
    maximumExcursion = Math.max(maximumExcursion, excursion);

    if (!reachedPeak && excursion >= REPETITION_PEAK_DEGREES) {
      reachedPeak = true;
    } else if (reachedPeak && excursion <= REPETITION_RETURN_DEGREES) {
      validRepetitions += 1;
      reachedPeak = false;
    }
  }

  return {
    estimatedAngle: Math.round(Math.min(maximumExcursion, 360) * 10) / 10,
    validRepetitions,
  };
}
