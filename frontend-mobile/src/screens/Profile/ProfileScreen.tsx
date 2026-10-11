import { authStore } from '@/services/AuthServices/authStore';
import { colors, spacing, typography } from '@/theme';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HealthcareConnectionCard } from './components/HealthcareConnectionCard';
import { LogoutButton } from './components/LogoutButton';
import { PatientSummaryCard } from './components/PatientSummaryCard';
import { ProfileHeader } from './components/ProfileHeader';
import { usePatientConnection } from './usePatientConnection';

export default function ProfileScreen() {
  const isPatient = authStore.user?.role === 'PATIENT';
  const { status, code, secondsRemaining, loading, generating, error, refreshStatus } =
    usePatientConnection(isPatient);
  const name =
    authStore.user?.namaLengkap ||
    authStore.user?.email?.split('@')[0] ||
    'Profil pasien';
  const initials = useMemo(
    () =>
      name === 'Profil pasien'
        ? authStore.user?.email?.slice(0, 1).toUpperCase() || 'P'
        : name.slice(0, 1).toUpperCase(),
    [name],
  );

  const logout = async () => {
    await authStore.clear();
    router.replace('/auth/Login');
  };

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
        <ProfileHeader />

        {error ? (
          <Text
            accessibilityRole="alert"
            style={{
              ...typography.caption,
              color: colors.danger,
              marginTop: spacing.md,
            }}
          >
            {error}
          </Text>
        ) : null}

        <PatientSummaryCard
          name={name}
          email={authStore.user?.email || 'Email tidak tersedia'}
          initials={initials}
        />

        {isPatient ? (
          <HealthcareConnectionCard
            status={status}
            code={code}
            secondsRemaining={secondsRemaining}
            loading={loading}
            generating={generating}
            onRefresh={refreshStatus}
          />
        ) : (
          <View style={{ marginTop: spacing.lg }}>
            <Text
              style={{
                ...typography.body,
                color: colors.textSecondary,
                textAlign: 'center',
              }}
            >
              Profil dan koneksi Nakes hanya tersedia untuk akun pasien.
            </Text>
          </View>
        )}

        <LogoutButton onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  );
}
