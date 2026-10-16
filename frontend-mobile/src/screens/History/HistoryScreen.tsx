import { authStore } from '@/services/AuthServices/authStore';
import {
  getMyTherapySessions,
  type TherapySession,
  type TherapyType,
} from '@/services/therapy.service';
import { colors, radius, spacing, typography } from '@/theme';
import { router, useFocusEffect } from 'expo-router';
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  History,
  RotateCcw,
  Smartphone,
  TrendingUp,
  Video,
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterType = 'ALL' | TherapyType;

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const weekday = date.toLocaleDateString('id-ID', { weekday: 'short' });
  const day = date.getDate();
  const monthYear = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  return { weekday, day, monthYear };
}

function formatFullDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);

  const fetchHistory = useCallback(async (isRefresh = false) => {
    if (!authStore.token) {
      setError('Sesi login tidak ditemukan. Silakan masuk kembali.');
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const data = await getMyTherapySessions(authStore.token);
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Riwayat terapi gagal dimuat. Silakan coba lagi.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchHistory();
    }, [fetchHistory]),
  );

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (filter === 'ALL') return true;
      return (s.therapyType || 'GYROSCOPE') === filter;
    });
  }, [sessions, filter]);

  // Statistics calculation (matching web format)
  const stats = useMemo(() => {
    const totalCount = sessions.length;
    if (totalCount === 0) {
      return { total: 0, avgReps: 0, avgAngle: '—' };
    }
    const gyroSessions = sessions.filter(
      (s) => (s.therapyType || 'GYROSCOPE') === 'GYROSCOPE',
    );
    const avgReps = Math.round(
      sessions.reduce((acc, curr) => acc + (curr.validRepetitions || 0), 0) /
        totalCount,
    );
    const avgAngle = gyroSessions.length
      ? `${Math.round(
          gyroSessions.reduce(
            (acc, curr) => acc + (curr.estimatedAngle || 0),
            0,
          ) / gyroSessions.length,
        )}°`
      : '—';

    return {
      total: totalCount,
      avgReps,
      avgAngle,
    };
  }, [sessions]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchHistory(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityLabel="Kembali"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={{ ...typography.display, color: colors.textPrimary }}>
              Riwayat Terapi
            </Text>
            <Text style={styles.headerSubtitle}>
              Catatan sesi latihan dan progres terapi Anda
            </Text>
          </View>
        </View>

        {/* ── KPI Summary Cards ── */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: colors.primary + '15' }]}>
              <Activity size={20} color={colors.primary} />
            </View>
            <Text style={styles.kpiValue}>{stats.total}</Text>
            <Text style={styles.kpiLabel}>Total Sesi</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: colors.success + '15' }]}>
              <TrendingUp size={20} color={colors.success} />
            </View>
            <Text style={styles.kpiValue}>{stats.avgReps}</Text>
            <Text style={styles.kpiLabel}>Rata² Repetisi</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: colors.accentTeal + '25' }]}>
              <Compass size={20} color={colors.primaryDark} />
            </View>
            <Text style={styles.kpiValue}>{stats.avgAngle}</Text>
            <Text style={styles.kpiLabel}>Sudut Rata²</Text>
          </View>
        </View>

        {/* ── Filter Pills ── */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => setFilter('ALL')}
            style={[styles.filterPill, filter === 'ALL' && styles.filterPillActive]}
          >
            <Text
              style={[
                styles.filterPillText,
                filter === 'ALL' && styles.filterPillTextActive,
              ]}
            >
              Semua ({sessions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('GYROSCOPE')}
            style={[styles.filterPill, filter === 'GYROSCOPE' && styles.filterPillActive]}
          >
            <Smartphone size={14} color={filter === 'GYROSCOPE' ? colors.white : colors.textSecondary} />
            <Text
              style={[
                styles.filterPillText,
                filter === 'GYROSCOPE' && styles.filterPillTextActive,
              ]}
            >
              Gyroscope
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('CAMERA')}
            style={[styles.filterPill, filter === 'CAMERA' && styles.filterPillActive]}
          >
            <Video size={14} color={filter === 'CAMERA' ? colors.white : colors.textSecondary} />
            <Text
              style={[
                styles.filterPillText,
                filter === 'CAMERA' && styles.filterPillTextActive,
              ]}
            >
              Kamera
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Error Banner ── */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => fetchHistory()} style={styles.retryButton}>
              <RotateCcw size={16} color={colors.danger} />
              <Text style={styles.retryText}>Coba lagi</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ── Loading State ── */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Memuat riwayat sesi terapi...</Text>
          </View>
        ) : filteredSessions.length === 0 ? (
          /* ── Empty State ── */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <History size={40} color={colors.primary} />
            </View>
            <Text style={{ ...typography.h2, color: colors.textPrimary, marginTop: spacing.md }}>
              Belum ada riwayat terapi
            </Text>
            <Text style={styles.emptySubtext}>
              {filter === 'ALL'
                ? 'Sesi terapi yang Anda lakukan akan tercatat otomatis di sini dan dapat dipantau oleh dokter.'
                : `Belum ada sesi latihan dengan metode ${filter.toLowerCase()}.`}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/therapy')}
              style={styles.ctaButton}
            >
              <Text style={{ ...typography.button, color: colors.white }}>
                Mulai Terapi Sekarang
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Session Cards List ── */
          <View style={styles.listContainer}>
            <Text style={styles.listSectionTitle}>
              Daftar Sesi ({filteredSessions.length})
            </Text>

            {filteredSessions.map((session) => {
              const { weekday, day, monthYear } = formatDate(session.performedAt);
              const isCamera = session.therapyType === 'CAMERA';

              return (
                <TouchableOpacity
                  key={session.id}
                  style={styles.sessionCard}
                  activeOpacity={0.75}
                  onPress={() => setSelectedSession(session)}
                >
                  {/* Left: Date Box */}
                  <View style={styles.dateBox}>
                    <Text style={styles.dateWeekday}>{weekday.toUpperCase()}</Text>
                    <Text style={styles.dateDay}>{day}</Text>
                    <Text style={styles.dateMonthYear}>{monthYear}</Text>
                  </View>

                  {/* Middle: Details */}
                  <View style={styles.sessionDetails}>
                    <View style={styles.sessionTitleRow}>
                      <Text style={styles.sessionProgramName} numberOfLines={1}>
                        {session.programName}
                      </Text>
                    </View>

                    {/* Method & Status badges */}
                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.methodBadge,
                          {
                            backgroundColor: isCamera
                              ? colors.accentTeal + '20'
                              : colors.primary + '15',
                          },
                        ]}
                      >
                        {isCamera ? (
                          <Video size={12} color={colors.primaryDark} />
                        ) : (
                          <Smartphone size={12} color={colors.primary} />
                        )}
                        <Text
                          style={[
                            styles.methodBadgeText,
                            {
                              color: isCamera ? colors.primaryDark : colors.primary,
                            },
                          ]}
                        >
                          {isCamera ? 'Kamera' : 'Gyroscope'}
                        </Text>
                      </View>

                      <View style={styles.statusBadge}>
                        <CheckCircle2 size={12} color={colors.success} />
                        <Text style={styles.statusBadgeText}>Selesai</Text>
                      </View>
                    </View>

                    {/* Metrics grid */}
                    <View style={styles.metricsRow}>
                      <View style={styles.metricItem}>
                        <Clock size={12} color={colors.textSecondary} />
                        <Text style={styles.metricText}>
                          {formatDuration(session.durationMs)}
                        </Text>
                      </View>

                      <View style={styles.metricDivider} />

                      <View style={styles.metricItem}>
                        <TrendingUp size={12} color={colors.textSecondary} />
                        <Text style={styles.metricText}>
                          {session.validRepetitions} repetisi
                        </Text>
                      </View>

                      <View style={styles.metricDivider} />

                      <View style={styles.metricItem}>
                        <Compass size={12} color={colors.textSecondary} />
                        <Text style={styles.metricText}>
                          {session.estimatedAngle}° sudut
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ── Detail Modal ── */}
      <Modal
        visible={!!selectedSession}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedSession(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSession && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...typography.caption, color: colors.primary, textTransform: 'uppercase' }}>
                      Detail Sesi Terapi
                    </Text>
                    <Text style={{ ...typography.h1, color: colors.textPrimary, marginTop: 2 }}>
                      {selectedSession.programName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedSession(null)}
                    style={styles.modalCloseButton}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalDivider} />

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalInfoRow}>
                    <Calendar size={16} color={colors.textSecondary} />
                    <Text style={styles.modalInfoLabel}>Waktu:</Text>
                    <Text style={styles.modalInfoValue}>
                      {formatFullDateTime(selectedSession.performedAt)}
                    </Text>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Smartphone size={16} color={colors.textSecondary} />
                    <Text style={styles.modalInfoLabel}>Metode:</Text>
                    <Text style={styles.modalInfoValue}>
                      {selectedSession.therapyType === 'CAMERA' ? 'Kamera (Visual)' : 'Gyroscope (Sensor Gerak)'}
                    </Text>
                  </View>

                  <View style={styles.modalGrid}>
                    <View style={styles.modalGridCard}>
                      <Text style={styles.modalGridCardLabel}>Repetisi Valid</Text>
                      <Text style={styles.modalGridCardValue}>
                        {selectedSession.validRepetitions}
                      </Text>
                      <Text style={styles.modalGridCardSub}>Gerakan selesai</Text>
                    </View>

                    <View style={styles.modalGridCard}>
                      <Text style={styles.modalGridCardLabel}>Estimasi Sudut</Text>
                      <Text style={styles.modalGridCardValue}>
                        {selectedSession.estimatedAngle}°
                      </Text>
                      <Text style={styles.modalGridCardSub}>Rentang gerak</Text>
                    </View>

                    <View style={styles.modalGridCard}>
                      <Text style={styles.modalGridCardLabel}>Durasi Sesi</Text>
                      <Text style={styles.modalGridCardValue}>
                        {formatDuration(selectedSession.durationMs)}
                      </Text>
                      <Text style={styles.modalGridCardSub}>
                        {(selectedSession.durationMs / 1000).toFixed(1)} detik
                      </Text>
                    </View>

                    <View style={styles.modalGridCard}>
                      <Text style={styles.modalGridCardLabel}>Data Sampel</Text>
                      <Text style={styles.modalGridCardValue}>
                        {selectedSession.sampleCount}
                      </Text>
                      <Text style={styles.modalGridCardSub}>Titik pembacaan</Text>
                    </View>
                  </View>

                  <View style={styles.modalNoteBox}>
                    <Text style={styles.modalNoteTitle}>Catatan Medis</Text>
                    <Text style={styles.modalNoteContent}>
                      Sudut merupakan estimasi pergerakan dari sensor perangkat Anda dan telah tersinkronisasi ke dashboard tim medis untuk pemantauan proses pemulihan.
                    </Text>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  onPress={() => setSelectedSession(null)}
                  style={styles.modalActionButton}
                >
                  <Text style={{ ...typography.button, color: colors.white }}>Tutup</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.xs,
    marginBottom: spacing.xs,
  },
  titleContainer: {
    marginTop: spacing.xs,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  kpiContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  kpiValue: {
    ...typography.h2,
    color: colors.primaryDark,
    marginTop: 2,
  },
  kpiLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: colors.danger + '10',
    borderColor: colors.danger + '30',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    flex: 1,
    marginRight: spacing.sm,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  retryText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 18,
    maxWidth: 280,
  },
  ctaButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  listContainer: {
    gap: spacing.cardGap,
  },
  listSectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  sessionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  dateBox: {
    width: 64,
    height: 68,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dateWeekday: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryDark,
    lineHeight: 24,
  },
  dateMonthYear: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionProgramName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
    marginBottom: 8,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  methodBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.success + '15',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  statusBadgeText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
  },
  metricDivider: {
    width: 1,
    height: 10,
    backgroundColor: colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  modalCloseText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  modalBody: {
    marginBottom: spacing.md,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.xs,
  },
  modalInfoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalInfoValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  modalGridCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  modalGridCardLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  modalGridCardValue: {
    ...typography.h2,
    color: colors.primaryDark,
    marginVertical: 2,
  },
  modalGridCardSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  modalNoteBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  modalNoteTitle: {
    ...typography.label,
    color: colors.primaryDark,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalNoteContent: {
    ...typography.caption,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  modalActionButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
