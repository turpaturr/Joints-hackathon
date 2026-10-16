import { Button } from '@/components/Button';
import { useGyroscope } from '@/hooks/useGyroscope';
import { ApiError } from '@/services/api';
import { authStore } from '@/services/AuthServices/authStore';
import {
  createTherapySession,
  parseInstructionSteps,
  type Movement,
  type Prescription,
  type TherapySessionPayload,
} from '@/services/therapy.service';
import { colors, radius, spacing, typography } from '@/theme';
import { estimateTherapyMetrics } from '@/utils/therapyMetrics';
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp, Repeat } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SessionState = 'ready' | 'recording' | 'saving' | 'saveFailed' | 'done';

const PROGRAM_NAME = 'Latihan Lutut';

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function GyroscopeMode({
  onBack,
  movement,
  prescription,
}: {
  onBack: () => void;
  movement?: Movement | null;
  prescription?: Prescription | null;
}) {
  const [sessionState, setSessionState] = useState<SessionState>('ready');
  const [showSteps, setShowSteps] = useState(false);
  const activeProgramName = movement?.namaGerakan || movement?.nama || PROGRAM_NAME;
  const targetReps = prescription?.targetRepetisi ?? 10;
  const steps = parseInstructionSteps(movement?.instruksi);
  const imageUri = movement?.imageBase64
    ? `data:${movement.imageMimeType || 'image/jpeg'};base64,${movement.imageBase64}`
    : movement?.mediaUrl && !movement.mediaUrl.includes('youtube')
      ? movement.mediaUrl
      : null;
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalDuration, setFinalDuration] = useState(0);
  const [finalSampleCount, setFinalSampleCount] = useState(0);
  const [estimatedAngle, setEstimatedAngle] = useState(0);
  const [validRepetitions, setValidRepetitions] = useState(0);
  const [saveError, setSaveError] = useState('');
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingSessionRef = useRef<TherapySessionPayload | null>(null);

  const { latest, sampleCount, flush, reset } = useGyroscope({
    enabled: sessionState === 'recording',
    intervalMs: 100,
  });

  useEffect(() => {
    if (sessionState !== 'recording') return;
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [sessionState]);

  const handleStart = () => {
    reset();
    setElapsedMs(0);
    setSaveError('');
    pendingSessionRef.current = null;
    startTimeRef.current = Date.now();
    setSessionState('recording');
  };

  const sendSession = async (payload: TherapySessionPayload) => {
    const token = authStore.token;
    if (!token) {
      throw new Error('Sesi login berakhir. Silakan masuk kembali.');
    }
    await createTherapySession(payload, token);
  };

  const handleStop = async () => {
    const samples = flush();
    const duration = Date.now() - startTimeRef.current;
    const metrics = estimateTherapyMetrics(samples);
    const payload: TherapySessionPayload = {
      programName: activeProgramName,
      therapyType: 'GYROSCOPE',
      estimatedAngle: metrics.estimatedAngle,
      validRepetitions: metrics.validRepetitions,
      durationMs: duration,
      sampleCount: samples.length,
      performedAt: new Date(startTimeRef.current).toISOString(),
      prescriptionId: prescription?.id,
    };

    setFinalDuration(duration);
    setFinalSampleCount(samples.length);
    setEstimatedAngle(metrics.estimatedAngle);
    setValidRepetitions(metrics.validRepetitions);
    pendingSessionRef.current = payload;
    setSessionState('saving');
    setSaveError('');

    try {
      await sendSession(payload);
      setSessionState('done');
    } catch (error) {
      setSaveError(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : 'Sesi gagal dikirim. Periksa koneksi lalu coba lagi.',
      );
      setSessionState('saveFailed');
    }
  };

  const handleRetry = async () => {
    const payload = pendingSessionRef.current;
    if (!payload) {
      setSaveError('Data sesi tidak tersedia. Silakan mulai sesi baru.');
      return;
    }

    setSessionState('saving');
    setSaveError('');
    try {
      await sendSession(payload);
      setSessionState('done');
    } catch (error) {
      setSaveError(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : 'Sesi gagal dikirim. Periksa koneksi lalu coba lagi.',
      );
      setSessionState('saveFailed');
    }
  };

  const handleBack = () => {
    if (sessionState === 'saving') return;
    if (sessionState === 'saveFailed') {
      Alert.alert(
        'Sesi belum tersimpan',
        'Jika keluar sekarang, data sesi ini akan hilang.',
        [
          { text: 'Tetap di sini', style: 'cancel' },
          {
            text: 'Keluar',
            style: 'destructive',
            onPress: () => onBack(),
          },
        ],
      );
      return;
    }
    if (sessionState === 'recording') {
      Alert.alert(
        'Hentikan sesi?',
        'Sesi yang sedang berjalan akan dihentikan dan data tidak dikirim.',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Hentikan',
            style: 'destructive',
            onPress: () => {
              flush();
              onBack();
            },
          },
        ]
      );
      return;
    }
    onBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <View
        style={{
          paddingHorizontal: spacing.screenPadding,
          paddingTop: spacing.md,
        }}
      >
        <TouchableOpacity
          onPress={handleBack}
          disabled={sessionState === 'saving'}
          activeOpacity={0.7}
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -spacing.sm,
          }}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacing.screenPadding,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Movement Header & Guide ── */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.sm + 2,
            marginBottom: spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.bgBase }}
                resizeMode="cover"
              />
            ) : null}

            <View style={{ flex: 1 }}>
              <Text style={{ ...typography.h2, color: colors.textPrimary }} numberOfLines={1}>
                {activeProgramName}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 3,
                    backgroundColor: colors.primary + '15',
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    borderRadius: radius.full,
                  }}
                >
                  <Repeat size={10} color={colors.primary} />
                  <Text style={{ ...typography.caption, fontSize: 10, color: colors.primary, fontWeight: '600' }}>
                    Target: {targetReps} reps
                  </Text>
                </View>
                <Text style={{ ...typography.caption, fontSize: 11, color: colors.textSecondary }}>
                  Mode Sensor Gyro
                </Text>
              </View>
            </View>

            {steps.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowSteps((prev) => !prev)}
                style={{
                  padding: 6,
                  borderRadius: radius.sm,
                  backgroundColor: colors.bgBase,
                }}
              >
                {showSteps ? <ChevronUp size={16} color={colors.textSecondary} /> : <ChevronDown size={16} color={colors.textSecondary} />}
              </TouchableOpacity>
            )}
          </View>

          {showSteps && steps.length > 0 && (
            <View style={{ marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, gap: 6 }}>
              <Text style={{ ...typography.caption, fontWeight: '600', color: colors.textPrimary }}>
                Langkah Gerakan:
              </Text>
              {steps.map((st, idx) => (
                <Text key={idx} style={{ ...typography.caption, fontSize: 12, color: colors.textSecondary }}>
                  {idx + 1}. {st}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          {sessionState === 'ready' && <ReadyState />}
          {sessionState === 'recording' && (
            <RecordingState
              elapsedMs={elapsedMs}
              sampleCount={sampleCount}
              latest={latest}
            />
          )}
          {sessionState === 'saving' && <SavingState />}
          {sessionState === 'saveFailed' && <SaveFailedState message={saveError} />}
          {sessionState === 'done' && (
            <DoneState
              duration={finalDuration}
              sampleCount={finalSampleCount}
              estimatedAngle={estimatedAngle}
              validRepetitions={validRepetitions}
            />
          )}
        </View>

        <View style={{ marginTop: spacing.lg }}>
          {sessionState === 'ready' && (
            <Button title="Mulai Sesi" onPress={handleStart} />
          )}
          {sessionState === 'recording' && (
            <Button
              title="Hentikan Sesi"
              variant="primary"
              onPress={handleStop}
            />
          )}
          {sessionState === 'saving' && (
            <Button title="Mengirim Sesi" onPress={() => {}} loading />
          )}
          {sessionState === 'saveFailed' && (
            <Button title="Coba Kirim Lagi" onPress={handleRetry} />
          )}
          {sessionState === 'done' && (
            <Button
              title="Selesai"
              onPress={() => onBack()}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────── Sub-komponen ──────────────── */

function ReadyState() {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text
        style={{
          ...typography.h2,
          color: colors.textPrimary,
          textAlign: 'center',
        }}
      >
        Siap memulai?
      </Text>
      <Text
        style={{
          ...typography.body,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: spacing.sm,
        }}
      >
        Taruh HP sesuai posisi tubuh yang diinstruksikan, lalu tekan Mulai Sesi
        sebelum memulai.
      </Text>
    </View>
  );
}

function RecordingState({
  elapsedMs,
  sampleCount,
  latest,
}: {
  elapsedMs: number;
  sampleCount: number;
  latest: { x: number; y: number; z: number };
}) {
  return (
    <>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ ...typography.caption, color: colors.textSecondary }}>
          Durasi
        </Text>
        <Text
          style={{
            ...typography.display,
            color: colors.textPrimary,
            fontVariant: ['tabular-nums'],
            marginTop: spacing.xs,
          }}
        >
          {formatDuration(elapsedMs)}
        </Text>
      </View>

      <TiltVisualizer latest={latest} />

      <Text
        style={{
          ...typography.caption,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: spacing.md,
        }}
      >
        Gerakkan sesuai instruksi
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: spacing.md,
          marginTop: spacing.md,
        }}
      >
        <DataChip label="X" value={latest.x} />
        <DataChip label="Y" value={latest.y} />
        <DataChip label="Z" value={latest.z} />
      </View>

      <Text
        style={{
          ...typography.caption,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: spacing.sm,
        }}
      >
        {sampleCount} data terkumpul
      </Text>
    </>
  );
}

function TiltVisualizer({
  latest,
}: {
  latest: { x: number; y: number; z: number };
}) {
  const [rotateX] = useState(() => new Animated.Value(0));
  const [rotateY] = useState(() => new Animated.Value(0));
  const smoothRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const alpha = 0.3;
    smoothRef.current.x =
      smoothRef.current.x * (1 - alpha) + latest.x * alpha;
    smoothRef.current.y =
      smoothRef.current.y * (1 - alpha) + latest.y * alpha;

    const clampedX = Math.max(-1.5, Math.min(1.5, smoothRef.current.x));
    const clampedY = Math.max(-1.5, Math.min(1.5, smoothRef.current.y));

    rotateX.setValue(clampedX);
    rotateY.setValue(clampedY);
  }, [latest.x, latest.y, rotateX, rotateY]);

  const rotateXStr = rotateX.interpolate({
    inputRange: [-1.5, 1.5],
    outputRange: ['-25deg', '25deg'],
    extrapolate: 'clamp',
  });

  const rotateYStr = rotateY.interpolate({
    inputRange: [-1.5, 1.5],
    outputRange: ['-25deg', '25deg'],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        marginTop: spacing.lg,
      }}
    >
      <Animated.View
        style={{
          width: 140,
          height: 140,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 4,
          transform: [
            { perspective: 800 },
            { rotateX: rotateXStr },
            { rotateY: rotateYStr },
          ],
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.full,
            backgroundColor: colors.bgBase,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            width: 6,
            height: 6,
            borderRadius: radius.full,
            backgroundColor: colors.accentTeal,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            width: 6,
            height: 6,
            borderRadius: radius.full,
            backgroundColor: colors.border,
          }}
        />
      </Animated.View>
    </View>
  );
}

function DataChip({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
      <Text style={{ ...typography.caption, color: colors.textSecondary }}>
        {label}
      </Text>
      <Text
        style={{
          ...typography.caption,
          color: colors.textPrimary,
          fontVariant: ['tabular-nums'],
          fontFamily: 'Poppins_500Medium',
        }}
      >
        {value.toFixed(2)}
      </Text>
    </View>
  );
}

function DoneState({
  duration,
  sampleCount,
  estimatedAngle,
  validRepetitions,
}: {
  duration: number;
  sampleCount: number;
  estimatedAngle: number;
  validRepetitions: number;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      <CheckCircle size={64} color={colors.success} strokeWidth={1.8} />

      <Text
        style={{
          ...typography.h1,
          color: colors.textPrimary,
          marginTop: spacing.md,
        }}
      >
        Sesi tersimpan
      </Text>

      <Text
        style={{
          ...typography.body,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: spacing.sm,
        }}
      >
        Durasi {formatDuration(duration)} · {validRepetitions} repetisi · {estimatedAngle.toFixed(1)}°
      </Text>
      <Text
        style={{
          ...typography.caption,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: spacing.xs,
        }}
      >
        Estimasi dari {sampleCount} data gyroscope, bukan pengukuran medis.
      </Text>
    </View>
  );
}

function SavingState() {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ ...typography.h2, color: colors.textPrimary }}>
        Menyimpan sesi
      </Text>
      <Text
        style={{
          ...typography.body,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: spacing.sm,
        }}
      >
        Hasil terapi sedang dikirim ke server.
      </Text>
    </View>
  );
}

function SaveFailedState({ message }: { message: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ ...typography.h2, color: colors.danger }}>
        Sesi belum tersimpan
      </Text>
      <Text
        style={{
          ...typography.body,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: spacing.sm,
        }}
      >
        {message}
      </Text>
    </View>
  );
}