import { authStore } from '@/services/AuthServices/authStore';
import {
  getPatientFullProfile,
  type PatientProfileData,
} from '@/services/patient-profile.service';
import { colors, spacing, typography } from '@/theme';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HealthcareConnectionCard } from './components/HealthcareConnectionCard';
import { LogoutButton } from './components/LogoutButton';
import { PatientSummaryCard } from './components/PatientSummaryCard';
import { PersonalInfoCard } from './components/PersonalInfoCard';
import { ProfileHeader } from './components/ProfileHeader';
import { usePatientConnection } from './usePatientConnection';

export default function ProfileScreen() {
  const isPatient = authStore.user?.role === 'PATIENT';
  const { status, code, secondsRemaining, loading: connLoading, generating, error: connError, refreshStatus } =
    usePatientConnection(isPatient);

  const [fullProfile, setFullProfile] = useState<PatientProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!authStore.user?.id || !authStore.token) return;
    try {
      setProfileLoading(true);
      const data = await getPatientFullProfile(authStore.user.id, authStore.token);
      setFullProfile(data);
    } catch (err) {
      console.warn('[ProfileScreen] Failed to load full profile:', err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const name =
    fullProfile?.namaLengkap ||
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
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
          gap: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />

        {connError ? (
          <Text
            accessibilityRole="alert"
            style={{ ...typography.caption, color: colors.danger }}
          >
            {connError}
          </Text>
        ) : null}

        <PatientSummaryCard
          name={name}
          email={fullProfile?.email || authStore.user?.email || 'Email tidak tersedia'}
          initials={initials}
        />

        {isPatient ? (
          <HealthcareConnectionCard
            status={status}
            code={code}
            secondsRemaining={secondsRemaining}
            loading={connLoading}
            generating={generating}
            onRefresh={refreshStatus}
          />
        ) : (
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
              textAlign: 'center',
              paddingVertical: spacing.lg,
            }}
          >
            Profil dan koneksi Nakes hanya tersedia untuk akun pasien.
          </Text>
        )}

        {/* Informasi Pribadi (Editable nomor telepon & alamat, sisanya bawaan dari web) */}
        {profileLoading && !fullProfile ? (
          <View style={{ paddingVertical: spacing.lg, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : fullProfile && authStore.user ? (
          <PersonalInfoCard
            userId={authStore.user.id}
            profile={fullProfile}
            onProfileUpdated={(updated) => setFullProfile(updated)}
          />
        ) : null}

        <LogoutButton onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  );
}