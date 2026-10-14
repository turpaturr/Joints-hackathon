import { FeatureCard } from '@/components/FeatureCard';
import { colors, radius, spacing, typography } from '@/theme';
import { router } from 'expo-router';
import {
  Activity,
  History,
  MessageCircle,
  Pill,
} from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authStore } from '@/services/AuthServices/authStore';
import { TherapyProgressCard } from './components/TherapyProgressCard';

export default function HomeScreen() {
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

        {/* ── Hero Card: Terapi Hari Ini ── */}
        <View style={{ marginTop: spacing.xl }}>
          <TherapyProgressCard
            title="Latihan Lutut"
            currentDay={3}
            totalDays={42}
            frequency="3× minggu"
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
            onPress={() => router.push('/medication')}
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
            description="Ngobrol dulu sebelum konsultasi"
            onPress={() => router.push('/consult')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}