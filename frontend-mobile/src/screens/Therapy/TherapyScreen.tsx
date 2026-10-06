import { Button } from '@/components/Button';
import { useGyroscope } from '@/hooks/useGyroscope';
import { colors, radius, spacing, typography } from '@/theme';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SessionState = 'ready' | 'recording' | 'done';

const PROGRAM_NAME = 'Latihan Lutut';

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TherapyScreen() {
  const [sessionState, setSessionState] = useState<SessionState>('ready');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalDuration, setFinalDuration] = useState(0);
  const [finalSampleCount, setFinalSampleCount] = useState(0);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    startTimeRef.current = Date.now();
    setSessionState('recording');
  };

  const handleStop = () => {
    const samples = flush();
    const duration = Date.now() - startTimeRef.current;
    setFinalDuration(duration);
    setFinalSampleCount(samples.length);
    setSessionState('done');

    console.log('[Therapy] Sesi selesai:', {
      program_name: PROGRAM_NAME,
      duration_ms: duration,
      sample_count: samples.length,
    });
  };

  const handleBack = () => {
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
              router.back();
            },
          },
        ]
      );
      return;
    }
    router.back();
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
        <Text style={{ ...typography.h1, color: colors.textPrimary }}>
          {PROGRAM_NAME}
        </Text>
        <Text
          style={{
            ...typography.caption,
            color: colors.textSecondary,
            marginTop: spacing.xs,
          }}
        >
          Sesi terapi hari ini
        </Text>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          {sessionState === 'ready' && <ReadyState />}
          {sessionState === 'recording' && (
            <RecordingState
              elapsedMs={elapsedMs}
              sampleCount={sampleCount}
              latest={latest}
            />
          )}
          {sessionState === 'done' && (
            <DoneState
              duration={finalDuration}
              sampleCount={finalSampleCount}
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
          {sessionState === 'done' && (
            <Button
              title="Kembali ke Home"
              onPress={() => router.replace('/home')}
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
        Taruh HP sesuai posisi tubuh yang diinstruksikan, lalu tekan tombol "Mulai Sesi"
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
      {/* Timer */}
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

      {/* Visual 3D tilt */}
      <TiltVisualizer latest={latest} />

      {/* Instruksi */}
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

      {/* Data ringkas */}
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

      {/* Sample count */}
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

/* ──────────────── Visual 3D Tilt ──────────────── */

function TiltVisualizer({
  latest,
}: {
  latest: { x: number; y: number; z: number };
}) {
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const smoothRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Exponential moving average — bikin gerakan halus, tidak "goyang"
    const alpha = 0.3;
    smoothRef.current.x =
      smoothRef.current.x * (1 - alpha) + latest.x * alpha;
    smoothRef.current.y =
      smoothRef.current.y * (1 - alpha) + latest.y * alpha;

    // Clamp biar tidak pernah miring ekstrem
    const clampedX = Math.max(-1.5, Math.min(1.5, smoothRef.current.x));
    const clampedY = Math.max(-1.5, Math.min(1.5, smoothRef.current.y));

    rotateX.setValue(clampedX);
    rotateY.setValue(clampedY);
  }, [latest.x, latest.y, rotateX, rotateY]);

  // Interpolate ke derajat (max ±25°)
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
        {/* Marker tengah */}
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

        {/* Titik sudut sebagai orientasi */}
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

/* ──────────────── Data chip ──────────────── */

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

/* ──────────────── Done state ──────────────── */

function DoneState({
  duration,
  sampleCount,
}: {
  duration: number;
  sampleCount: number;
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
        Sesi selesai
      </Text>

      <Text
        style={{
          ...typography.body,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: spacing.sm,
        }}
      >
        Durasi {formatDuration(duration)} · {sampleCount} data
      </Text>
    </View>
  );
}