import { FeatureCard } from '@/components/FeatureCard';
import { colors, radius, spacing, typography } from '@/theme';
import { router } from 'expo-router';
import { History, MessageCircle, Pill } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: replace with real data from the doctor's program
const USER = { name: 'Roja' };
const THERAPY = {
  title: 'Latihan Lutut',
  time: '08.00',
  day: 3,
  totalDays: 42,
  frequency: '3× minggu',
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ ...typography.caption, color: colors.textSecondary }}>
        {label}
      </Text>
      <Text
        style={{
          ...typography.h2,
          color: colors.textPrimary,
          marginTop: spacing.xs,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const progress = Math.min(THERAPY.day / THERAPY.totalDays, 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.screenPadding,
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl * 1.5,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ ...typography.caption, color: colors.textSecondary }}>
              Semangat terapi hari ini
            </Text>
            <Text
              style={{
                ...typography.display,
                color: colors.textPrimary,
                marginTop: spacing.xs,
              }}
            >
              Halo, {USER.name}
            </Text>
          </View>

          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.full,
              backgroundColor: colors.bgBase,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: spacing.md,
            }}
          >
            <Text style={{ ...typography.h2, color: colors.primary }}>
              {USER.name.charAt(0)}
            </Text>
          </View>
        </View>

        {/* ── Hero: Terapi Hari Ini ── */}
        <View
          style={{
            marginTop: spacing.xl,
            backgroundColor: colors.primary,
            borderRadius: radius.lg,
            padding: spacing.lg,
          }}
        >
          <Text
            style={{
              ...typography.caption,
              color: colors.white,
              opacity: 0.8,
            }}
          >
            Terapi hari ini · {THERAPY.time}
          </Text>

          <Text
            style={{
              ...typography.h1,
              color: colors.white,
              marginTop: spacing.xs,
            }}
          >
            {THERAPY.title}
          </Text>

          {/* Progress */}
          <View style={{ marginTop: spacing.lg }}>
            <View
              style={{
                height: 4,
                borderRadius: radius.full,
                backgroundColor: 'rgba(255,255,255,0.25)',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  borderRadius: radius.full,
                  backgroundColor: colors.white,
                }}
              />
            </View>
            <Text
              style={{
                ...typography.caption,
                color: colors.white,
                opacity: 0.8,
                marginTop: spacing.sm,
              }}
            >
              Hari {THERAPY.day} dari {THERAPY.totalDays}
            </Text>
          </View>

          {/* CTA */}
          <Pressable
            onPress={() => router.push('/therapy')}
            style={({ pressed }) => ({
              marginTop: spacing.lg,
              backgroundColor: colors.white,
              borderRadius: radius.full,
              paddingVertical: spacing.md,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ ...typography.h2, color: colors.primary }}>
              Mulai Terapi
            </Text>
          </Pressable>
        </View>

        {/* ── Stats ── */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: spacing.md,
            padding: spacing.md,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.white,
          }}
        >
          <Stat
            label="Progres"
            value={`${Math.round(progress * 100)}%`}
          />
          <View
            style={{
              width: 1,
              backgroundColor: colors.border,
              marginHorizontal: spacing.md,
            }}
          />
          <Stat label="Frekuensi" value={THERAPY.frequency} />
        </View>

        {/* ── Aksi Cepat ── */}
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