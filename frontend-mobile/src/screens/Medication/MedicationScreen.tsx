import { ApiError } from '@/services/api';
import {
  getPatientMedicationSchedules,
  MedicationSchedule,
} from '@/services/medication.service';
import { authStore } from '@/services/AuthServices/authStore';
import { colors, radius, spacing, typography } from '@/theme';
import { router } from 'expo-router';
import { ArrowLeft, CalendarDays, Clock3, Pill, RefreshCw } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function dateKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTime(value: string): string {
  return value.slice(0, 5);
}

function isActiveToday(schedule: MedicationSchedule, today: string): boolean {
  const start = schedule.startDate ? dateKey(schedule.startDate) : today;
  const end = schedule.endDate ? dateKey(schedule.endDate) : today;
  return start <= today && today <= end;
}

function formatDateRange(schedule: MedicationSchedule): string {
  if (!schedule.startDate && !schedule.endDate) return 'Jadwal aktif';
  const start = schedule.startDate
    ? new Date(schedule.startDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      })
    : 'Mulai sekarang';
  const end = schedule.endDate
    ? new Date(schedule.endDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'tanpa batas';
  return `${start} - ${end}`;
}

function MedicationCard({ schedule }: { schedule: MedicationSchedule }) {
  const times = [...(schedule.timeToTake ?? [])].sort();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            width: spacing.xxl,
            height: spacing.xxl,
            borderRadius: radius.md,
            backgroundColor: `${colors.primary}15`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Pill size={24} color={colors.primary} strokeWidth={2} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={{ ...typography.h2, color: colors.textPrimary }}>
            {schedule.medicationName}
          </Text>
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            {schedule.dosage}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.accentLime,
            borderRadius: radius.full,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
          }}
        >
          <Text style={{ ...typography.label, color: colors.primaryDark }}>Aktif</Text>
        </View>
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.border,
          marginTop: spacing.md,
          paddingTop: spacing.md,
          gap: spacing.sm,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Clock3 size={20} color={colors.primary} strokeWidth={2} />
          <Text
            style={{
              ...typography.bodyMedium,
              color: colors.textPrimary,
              marginLeft: spacing.sm,
            }}
          >
            {times.length ? times.map(formatTime).join('  ·  ') : 'Waktu belum ditentukan'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CalendarDays size={20} color={colors.textSecondary} strokeWidth={2} />
          <Text
            style={{
              ...typography.caption,
              color: colors.textSecondary,
              marginLeft: spacing.sm,
            }}
          >
            {schedule.frequency}  ·  {formatDateRange(schedule)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function MedicationScreen() {
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadSchedules = useCallback(async (isRefresh = false) => {
    const token = authStore.token;
    if (!token) {
      setError('Sesi login tidak ditemukan. Silakan masuk kembali.');
      setLoading(false);
      return;
    }

    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      setSchedules(await getPatientMedicationSchedules(token));
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Jadwal obat gagal dimuat. Coba lagi.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSchedules();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadSchedules]);

  const today = dateKey(new Date());
  const activeSchedules = schedules.filter((schedule) => isActiveToday(schedule, today));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.screenPadding,
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadSchedules(true)}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          accessibilityLabel="Kembali ke halaman sebelumnya"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={{ width: spacing.xxl, height: spacing.xxl, justifyContent: 'center' }}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={{ ...typography.h1, color: colors.textPrimary, marginTop: spacing.md }}>
          Jadwal minum obat
        </Text>
        <Text
          style={{
            ...typography.body,
            color: colors.textSecondary,
            marginTop: spacing.xs,
          }}
        >
          Ikuti waktu yang sudah ditentukan dokter untuk membantu pemulihanmu.
        </Text>

        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: radius.lg,
            padding: spacing.md,
            marginTop: spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <CalendarDays size={28} color={colors.white} strokeWidth={2} />
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text style={{ ...typography.h2, color: colors.white }}>Obat hari ini</Text>
            <Text style={{ ...typography.body, color: colors.white }}>
              {activeSchedules.length
                ? `${activeSchedules.length} jadwal perlu diperhatikan`
                : 'Belum ada jadwal aktif'}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: spacing.xl }}>
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={{
                  ...typography.body,
                  color: colors.textSecondary,
                  marginTop: spacing.md,
                }}
              >
                Memuat jadwal obat...
              </Text>
            </View>
          ) : error ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                padding: spacing.lg,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  ...typography.body,
                  color: colors.danger,
                  textAlign: 'center',
                }}
              >
                {error}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => void loadSchedules()}
                style={{
                  minHeight: spacing.xxl,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: spacing.md,
                  paddingHorizontal: spacing.md,
                }}
              >
                <RefreshCw size={20} color={colors.primary} />
                <Text
                  style={{
                    ...typography.button,
                    color: colors.primary,
                    marginLeft: spacing.sm,
                  }}
                >
                  Coba lagi
                </Text>
              </TouchableOpacity>
            </View>
          ) : activeSchedules.length ? (
            <View style={{ gap: spacing.cardGap }}>
              {activeSchedules.map((schedule) => (
                <MedicationCard key={schedule.id} schedule={schedule} />
              ))}
            </View>
          ) : (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                padding: spacing.lg,
                alignItems: 'center',
              }}
            >
              <Pill size={32} color={colors.textSecondary} strokeWidth={1.8} />
              <Text
                style={{
                  ...typography.h2,
                  color: colors.textPrimary,
                  textAlign: 'center',
                  marginTop: spacing.md,
                }}
              >
                Belum ada jadwal obat
              </Text>
              <Text
                style={{
                  ...typography.body,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginTop: spacing.xs,
                }}
              >
                Jadwal dari dokter akan muncul di sini.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
