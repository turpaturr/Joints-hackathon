import { FeatureCard } from '@/components/FeatureCard';
import { colors, radius, spacing, typography } from '@/theme';
import { router, useFocusEffect } from 'expo-router';
import {
  Activity,
  History,
  MessageCircle,
  Pill,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authStore } from '@/services/AuthServices/authStore';
import {
  calculateTherapyProgress,
  getMyPrescriptions,
  type Prescription,
} from '@/services/therapy.service';
import { TherapyProgressCard } from './components/TherapyProgressCard';

export default function HomeScreen() {
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);

  const fetchPrescription = useCallback(async () => {
    const token = authStore.token;
    if (!token) return;
    try {
      setLoadingPrescription(true);
      const list = await getMyPrescriptions(token);
      if (list && list.length > 0) {
        // Pick the most relevant prescription (e.g., ongoing, or latest)
        const sorted = [...list].sort((a, b) => {
          const tA = new Date(a.tanggalBerakhir || a.createdAt || 0).getTime();
          const tB = new Date(b.tanggalBerakhir || b.createdAt || 0).getTime();
          return tB - tA;
        });
        setActivePrescription(sorted[0]);
      } else {
        setActivePrescription(null);
      }
    } catch (err) {
      console.warn('[HomeScreen] Failed to load prescriptions:', err);
    } finally {
      setLoadingPrescription(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPrescription();
    }, [fetchPrescription]),
  );

  // Dynamic progress calculated from doctor's assigned therapy dates
  const progress = calculateTherapyProgress(
    activePrescription?.tanggalMulai,
    activePrescription?.tanggalBerakhir,
  );

  const movementTitle =
    activePrescription?.movement?.namaGerakan ||
    activePrescription?.movement?.nama ||
    (activePrescription ? 'Latihan Terapi' : 'Latihan Mandiri');

  const frequencyLabel = activePrescription?.frekuensiPerHari
    ? `${activePrescription.frekuensiPerHari}× sehari (${activePrescription.targetRepetisi ?? 10} rep)`
    : 'Setiap hari';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.screenPadding,
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header: Greeting + Avatar ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ ...typography.display, color: colors.textPrimary }}>
              Hai, {authStore.user?.namaLengkap || 'Pasien'}
            </Text>
            <Text
              style={{
                ...typography.caption,
                color: colors.textSecondary,
                marginTop: spacing.xs,
              }}
            >
              Semangat terapi hari ini
            </Text>
          </View>

          <TouchableOpacity
            accessibilityLabel="Buka profil saya"
            accessibilityRole="button"
            disabled={authStore.user?.role !== 'PATIENT'}
            onPress={() => router.push('/profile')}
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: spacing.md,
            }}
          >
            <Text style={{ ...typography.h2, color: colors.white }}>
              {authStore.user?.namaLengkap?.slice(0, 1).toUpperCase() ||
                authStore.user?.email?.slice(0, 1).toUpperCase() ||
                'P'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginTop: spacing.lg,
          }}
        />

        {/* ── Hero Card: Terapi Hari Ini (Dynamic Date Progression) ── */}
        <View style={{ marginTop: spacing.xl }}>
          <TherapyProgressCard
            title={movementTitle}
            currentDay={activePrescription ? progress.currentDay : 1}
            totalDays={activePrescription ? progress.totalDays : 14}
            percent={activePrescription ? progress.percent : 7}
            frequency={frequencyLabel}
            dateRange={activePrescription ? progress.dateRangeLabel : 'Periode Terapi'}
            hasPrescription={!!activePrescription}
            onPress={() => router.push('/therapy')}
          />
        </View>

        {/* ── Section: Aksi Cepat ── */}
        <Text
          style={{
            ...typography.h2,
            color: colors.textPrimary,
            marginTop: spacing.xl,
            marginBottom: spacing.md,
          }}
        >
          Aksi Cepat
        </Text>

        <View style={{ gap: spacing.cardGap }}>
          <FeatureCard
            icon={Activity}
            title="Terapi Sekarang"
            description="Mulai sesi terapi hari ini"
            onPress={() => router.push('/therapy')}
            highlight
          />
          <FeatureCard
            icon={Pill}
            title="Jadwal Minum Obat"
            description="Lihat jadwal & catat minum obat"
            onPress={() => router.push('/medication' as any)}
          />
          <FeatureCard
            icon={History}
            title="Riwayat Terapi"
            description="Lihat progres terapimu"
            onPress={() => router.push('/history')}
          />
          <FeatureCard
            icon={MessageCircle}
            title="Keluhan ke Dokter"
            description="Buat dan pantau laporan konsultasi"
            onPress={() => router.push('/consult')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}