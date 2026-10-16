import { colors, radius, spacing, typography } from '@/theme';
import { router, useFocusEffect } from 'expo-router';
import {
  Activity,
  ArrowLeft,
  Calendar,
  ChevronRight,
  Flame,
  RefreshCw,
  Smartphone,
  Video,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authStore } from '@/services/AuthServices/authStore';
import {
  getMyPrescriptions,
  listMovements,
  type Movement,
  type Prescription,
} from '@/services/therapy.service';
import { CameraMode } from './CameraMode';
import { GyroscopeMode } from './GyroscopeMode';
import { MovementGuideCard } from './components/MovementGuideCard';

type TherapyMode = 'menu' | 'gyroscope' | 'camera';

export default function TherapyScreen() {
  const [activeMode, setActiveMode] = useState<TherapyMode>('menu');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    const token = authStore.token;
    if (!token) return;
    try {
      setLoading(true);
      setError('');

      const [myPrescriptions, allMovements] = await Promise.all([
        getMyPrescriptions(token).catch((e) => {
          console.warn('[TherapyScreen] getMyPrescriptions error:', e);
          return [] as Prescription[];
        }),
        listMovements(token).catch((e) => {
          console.warn('[TherapyScreen] listMovements error:', e);
          return [] as Movement[];
        }),
      ]);

      setPrescriptions(myPrescriptions || []);
      setMovements(allMovements || []);
      setSelectedIndex(0);
    } catch (err: any) {
      console.warn('[TherapyScreen] Failed to load therapy data:', err);
      setError(err?.message || 'Gagal memuat gerakan terapi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  // Determine current active item (prescription or general movement)
  const currentPrescription = prescriptions.length > 0 ? prescriptions[selectedIndex] || prescriptions[0] : null;
  const currentMovement: Movement | null =
    currentPrescription?.movement ||
    (movements.length > 0 ? movements[selectedIndex] || movements[0] : null);

  // Jika mode gyro dipilih, render komponen GyroscopeMode
  if (activeMode === 'gyroscope') {
    return (
      <GyroscopeMode
        onBack={() => setActiveMode('menu')}
        movement={currentMovement}
        prescription={currentPrescription}
      />
    );
  }

  // Jika mode kamera dipilih, render komponen CameraMode
  if (activeMode === 'camera') {
    return (
      <CameraMode
        onBack={() => setActiveMode('menu')}
        movement={currentMovement}
        prescription={currentPrescription}
      />
    );
  }

  // Tampilan Menu Utama
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Kembali"
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ ...typography.h2, color: colors.textPrimary, marginLeft: spacing.xs }}>
          Gerakan Terapi
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Memuat panduan gerakan terapi…</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadData}>
              <RefreshCw size={14} color={colors.primary} />
              <Text style={styles.retryBtnText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Multi-movement switcher if there are multiple prescriptions or movements */}
            {(prescriptions.length > 1 || (!prescriptions.length && movements.length > 1)) && (
              <View style={styles.switcherSection}>
                <Text style={styles.switcherLabel}>Pilih Program Latihan:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.switcherRow}
                >
                  {(prescriptions.length > 0 ? prescriptions : movements).map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const itemName =
                      'movement' in item && item.movement
                        ? item.movement.namaGerakan || item.movement.nama
                        : (item as Movement).namaGerakan || (item as Movement).nama || `Gerakan ${idx + 1}`;

                    return (
                      <TouchableOpacity
                        key={item.id || idx}
                        style={[styles.switcherChip, isSelected && styles.switcherChipActive]}
                        onPress={() => setSelectedIndex(idx)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.switcherChipText,
                            isSelected && styles.switcherChipTextActive,
                          ]}
                        >
                          {itemName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* ── Panduan Gerakan (Gambar di atas + langkah-langkah) ── */}
            {currentMovement ? (
              <MovementGuideCard
                movement={currentMovement}
                prescription={currentPrescription}
              />
            ) : (
              <View style={styles.emptyGuideCard}>
                <Flame size={32} color={colors.primary} />
                <Text style={{ ...typography.h2, color: colors.textPrimary, marginTop: spacing.sm }}>
                  Belum Ada Program Terapi
                </Text>
                <Text style={{ ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: 4 }}>
                  Dokter belum menugaskan program terapi spesifik untuk Anda. Anda tetap dapat menggunakan sensor untuk latihan mandiri.
                </Text>
              </View>
            )}

            {/* ── Section: Pilih Mode Latihan ── */}
            <View style={styles.modeSectionHeader}>
              <Text style={{ ...typography.h2, color: colors.textPrimary }}>
                Mulai Sesi Terapi
              </Text>
              <Text style={styles.modeSubtitle}>
                Pilih metode perekaman gerakan yang Anda inginkan:
              </Text>
            </View>

            <View style={styles.menuContainer}>
              {/* Tombol Mode Gyroscope */}
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.75}
                onPress={() => setActiveMode('gyroscope')}
              >
                <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                  <Smartphone size={30} color={colors.primary} />
                </View>
                <View style={styles.cardText}>
                  <Text style={{ ...typography.h2, color: colors.textPrimary }}>
                    Sensor Gerak (Gyroscope)
                  </Text>
                  <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: 4, lineHeight: 18 }}>
                    Tempelkan atau pegang HP pada anggota tubuh untuk mengukur sudut dan repetisi gerakan otomatis.
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} style={{ marginLeft: spacing.xs }} />
              </TouchableOpacity>

              {/* Tombol Mode Kamera */}
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.75}
                onPress={() => setActiveMode('camera')}
              >
                <View style={[styles.iconBox, { backgroundColor: colors.accentTeal + '20' }]}>
                  <Video size={30} color={colors.accentTeal} />
                </View>
                <View style={styles.cardText}>
                  <Text style={{ ...typography.h2, color: colors.textPrimary }}>
                    Rekaman Visual (Kamera)
                  </Text>
                  <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: 4, lineHeight: 18 }}>
                    Rekam video gerakan Anda di depan kamera untuk dievaluasi posturnya oleh dokter.
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} style={{ marginLeft: spacing.xs }} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgBase },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
  loadingBox: {
    paddingVertical: spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: '#991b1b',
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  retryBtnText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  switcherSection: {
    marginBottom: spacing.md,
  },
  switcherLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  switcherRow: {
    gap: spacing.xs,
  },
  switcherChip: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switcherChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  switcherChipText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  switcherChipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  emptyGuideCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  modeSectionHeader: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  modeSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuContainer: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: spacing.md,
  },
});