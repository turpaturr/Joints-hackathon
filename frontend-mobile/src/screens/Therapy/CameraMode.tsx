import { Button } from '@/components/Button';
import { authStore } from '@/services/AuthServices/authStore';
import { colors, radius, spacing, typography } from '@/theme';
import { ArrowLeft, CheckCircle, Video as VideoIcon } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';

type SessionState = 'ready' | 'recording' | 'saving' | 'saveFailed' | 'done';

const PROGRAM_NAME = 'Latihan Leher (Visual)';

function now() {
  return Date.now();
}

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function CameraMode({ onBack }: { onBack: () => void }) {
  const [sessionState, setSessionState] = useState<SessionState>('ready');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalDuration, setFinalDuration] = useState(0);
  const [saveError, setSaveError] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  
  const [instruction, setInstruction] = useState('Posisikan wajah Anda di tengah');

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const [cameraPerm, requestCameraPerm] = useCameraPermissions();
  const [micPerm, requestMicPerm] = useMicrophonePermissions();

  useEffect(() => {
    if (sessionState !== 'recording') return;
    
    timerRef.current = setInterval(() => {
      const currentElapsed = Date.now() - startTimeRef.current;
      setElapsedMs(currentElapsed);

      const seconds = Math.floor(currentElapsed / 1000);
      if (seconds >= 0 && seconds < 5) setInstruction('Bersiaplah, lihat lurus ke depan');
      else if (seconds >= 5 && seconds < 15) setInstruction('Tolehkan kepala perlahan ke KANAN');
      else if (seconds >= 15 && seconds < 25) setInstruction('Tolehkan kepala perlahan ke KIRI');
      else if (seconds >= 25 && seconds < 35) setInstruction('Tundukkan kepala ke BAWAH');
      else if (seconds >= 35 && seconds < 45) setInstruction('Angkat kepala ke ATAS');
      else setInstruction('Pertahankan posisi...');

    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [sessionState]);

  const handleStart = async () => {
    if (!cameraRef.current) return;
    
    setElapsedMs(0);
    setSaveError('');
    startTimeRef.current = now();
    setSessionState('recording');

    try {
      const videoRecordPromise = cameraRef.current.recordAsync({
        maxDuration: 60,
      });
      
      const data = await videoRecordPromise;
      if (data) {
        setVideoUri(data.uri);
        void uploadVideo(data.uri, now() - startTimeRef.current);
      }
    } catch (e) {
      console.error('Gagal merekam:', e);
      Alert.alert('Error', 'Gagal merekam video');
      setSessionState('ready');
    }
  };

  const handleStop = () => {
    if (cameraRef.current && sessionState === 'recording') {
      cameraRef.current.stopRecording();
      setSessionState('saving');
    }
  };

  const uploadVideo = async (uri: string, duration: number) => {
    setFinalDuration(duration);
    setSessionState('saving');
    
    try {
      const token = authStore.token;
      if (!token) throw new Error('Sesi login berakhir.');

      const formData = new FormData();
      formData.append('programName', PROGRAM_NAME);
      formData.append('durationMs', duration.toString());
      
      formData.append('videoFile', {
        uri: uri,
        name: `therapy_${Date.now()}.mp4`,
        type: 'video/mp4',
      } as any);

      await new Promise(resolve => setTimeout(resolve, 2000));
      setSessionState('done');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Video gagal dikirim.');
      setSessionState('saveFailed');
    }
  };

  const handleBack = () => {
    if (sessionState === 'saving') return;
    if (sessionState === 'recording') {
      Alert.alert(
        'Hentikan sesi?',
        'Sesi yang sedang berjalan akan dihentikan.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Hentikan', style: 'destructive', onPress: () => {
              if (cameraRef.current) cameraRef.current.stopRecording();
              onBack();
            } 
          },
        ]
      );
      return;
    }
    onBack();
  };

  if (!cameraPerm || !micPerm) return <SafeAreaView style={styles.safeArea} />;
  if (!cameraPerm.granted || !micPerm.granted) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', padding: 20 }]}>
        <Text style={{ ...typography.h2, textAlign: 'center', marginBottom: 20 }}>
          Butuh Akses Kamera & Mic
        </Text>
        <Button 
          title="Berikan Izin" 
          onPress={() => { requestCameraPerm(); requestMicPerm(); }} 
        />
        <View style={{ marginTop: 10 }}>
          <Button 
            title="Kembali" 
            variant="secondary" 
            onPress={() => onBack()} 
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} disabled={sessionState === 'saving'} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={{ ...typography.h1, color: colors.textPrimary }}>{PROGRAM_NAME}</Text>
        <Text style={styles.subtitle}>Rekaman visual terapi pergerakan leher</Text>

        <View style={styles.contentContainer}>
          
          {(sessionState === 'ready' || sessionState === 'recording') && (
            <View style={styles.cameraWrapper}>
              <CameraView 
                ref={cameraRef}
                style={styles.camera} 
                facing="front" 
                mode="video" 
              />
                <FaceGuideOverlay />
              
              {sessionState === 'recording' && (
                <View style={styles.recordingOverlay}>
                  <View style={styles.timerBadge}>
                    <View style={styles.redDot} />
                    <Text style={styles.timerText}>{formatDuration(elapsedMs)}</Text>
                  </View>
                  <View style={styles.instructionBadge}>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {sessionState === 'ready' && <ReadyState />}
          {sessionState === 'saving' && <SavingState />}
          {sessionState === 'saveFailed' && <SaveFailedState message={saveError} />}
          {sessionState === 'done' && <DoneState duration={finalDuration} />}
        </View>

        <View style={{ marginTop: spacing.lg }}>
          {sessionState === 'ready' && <Button title="Mulai Rekam Sesi" onPress={handleStart} />}
          {sessionState === 'recording' && <Button title="Selesai & Kirim" variant="primary" onPress={handleStop} />}
          {sessionState === 'saving' && <Button title="Mengirim Video..." onPress={() => {}} loading />}
          {sessionState === 'saveFailed' && videoUri && (
            <Button
              title="Coba Kirim Lagi"
              onPress={() => void uploadVideo(videoUri, finalDuration)}
            />
          )}
          {sessionState === 'done' && <Button title="Selesai" onPress={() => onBack()} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FaceGuideOverlay() {
  return (
    <View style={styles.overlayContainer} pointerEvents="none">
      {/* Area gelap di luar oval */}
      <View style={styles.darkness} />

      <View style={styles.centerRow}>
        <View style={styles.darkness} />

        {/* Bingkai Oval untuk Wajah */}
        <View style={styles.faceOval}>
          {/* Sudut-sudut panduan agar terlihat seperti scanner */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.darkness} />
      </View>

      <View style={styles.darkness} />
    </View>
  );
}

/* ──────────────── Sub-komponen ──────────────── */

function ReadyState() {
  return (
    <View style={styles.card}>
      <Text style={{ ...typography.h2, color: colors.textPrimary, textAlign: 'center' }}>Siap memulai?</Text>
      <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
        Posisikan HP Anda sejajar dengan wajah. Ikuti instruksi arah kemiringan kepala yang akan muncul di layar.
      </Text>
    </View>
  );
}

function SavingState() {
  return (
    <View style={{ alignItems: 'center', marginTop: 40 }}>
      <VideoIcon size={48} color={colors.primary} />
      <Text style={{ ...typography.h2, color: colors.textPrimary, marginTop: 16 }}>Mengunggah Video</Text>
      <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: 8 }}>
        Mohon tunggu, video sedang dikirim ke dokter Anda.
      </Text>
    </View>
  );
}

function SaveFailedState({ message }: { message: string }) {
  return (
    <View style={{ alignItems: 'center', marginTop: 40 }}>
      <Text style={{ ...typography.h2, color: colors.danger }}>Gagal Mengunggah</Text>
      <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: 8 }}>{message}</Text>
    </View>
  );
}

function DoneState({ duration }: { duration: number }) {
  return (
    <View style={{ alignItems: 'center', marginTop: 40 }}>
      <CheckCircle size={64} color={colors.success} strokeWidth={1.8} />
      <Text style={{ ...typography.h1, color: colors.textPrimary, marginTop: spacing.md }}>Sesi Terkirim</Text>
      <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
        Durasi rekaman: {formatDuration(duration)}
      </Text>
    </View>
  );
}

/* ──────────────── Styles ──────────────── */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgBase },
  header: { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.md },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -spacing.sm },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.screenPadding, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  contentContainer: { flex: 1, justifyContent: 'center', marginTop: spacing.lg },
  
  cameraWrapper: {
    height: 400,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: spacing.md,
  },
  camera: { flex: 1 },
  recordingOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  timerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  redDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger },
  timerText: { color: 'white', ...typography.caption, fontVariant: ['tabular-nums'] },
  instructionBadge: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  instructionText: {
    color: '#00FF00',
    ...typography.h2,
    textAlign: 'center',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
  },
  darkness: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  centerRow: {
    height: 240,
    flexDirection: 'row',
  },
  faceOval: {
    width: 180,
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 90,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#00FF00',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});