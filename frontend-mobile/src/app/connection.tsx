import { ApiError } from '@/services/api';
import {
  createPatientConnectionCode,
  getPatientConnectionStatus,
  type PatientConnectionStatus,
} from '@/services/connection.service';
import { authStore } from '@/services/AuthServices/authStore';
import { colors, radius, spacing, typography } from '@/theme';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConnectionScreen() {
  const isPatient = authStore.user?.role === 'PATIENT';
  const [status, setStatus] = useState<PatientConnectionStatus | null>(null);
  const [code, setCode] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [now, setNow] = useState(0);
  const [loading, setLoading] = useState(Boolean(authStore.token && isPatient));
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(
    isPatient && !authStore.token
      ? 'Sesi login tidak ditemukan. Silakan masuk kembali.'
      : '',
  );

  const secondsRemaining = useMemo(
    () => (expiresAt ? Math.max(0, Math.ceil((Date.parse(expiresAt) - now) / 1000)) : 0),
    [expiresAt, now],
  );

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = authStore.token;
    if (!token || !isPatient) return;

    let isActive = true;

    const loadConnection = async () => {
      let connection: PatientConnectionStatus;
      try {
        connection = await getPatientConnectionStatus(token);
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : 'Status koneksi gagal dimuat. Coba lagi.',
          );
          setLoading(false);
        }
        return;
      }

      if (!isActive) return;
      setStatus(connection);

      if (connection.connected) {
        setLoading(false);
        return;
      }

      setGenerating(true);
      try {
        const result = await createPatientConnectionCode(token);
        if (isActive) {
          setCode(result.code);
          setExpiresAt(result.expiresAt);
          setNow(Date.now());
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : 'Kode gagal dibuat. Coba lagi.',
          );
        }
      } finally {
        if (isActive) {
          setGenerating(false);
          setLoading(false);
        }
      }
    };

    void loadConnection();
    return () => {
      isActive = false;
    };
  }, [isPatient]);

  const handleCreateCode = async () => {
    if (!authStore.token) {
      setError('Sesi login tidak ditemukan. Silakan masuk kembali.');
      return;
    }

    setGenerating(true);
    setError('');
    try {
      const result = await createPatientConnectionCode(authStore.token);
      setCode(result.code);
      setExpiresAt(result.expiresAt);
      setNow(Date.now());
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Kode gagal dibuat. Coba lagi.',
      );
    } finally {
      setGenerating(false);
    }
  };

  const formatRemaining = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacing.screenPadding,
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
        }}
      >

        <Text
          style={{
            ...typography.display,
            color: colors.textPrimary,
            marginTop: spacing.lg,
          }}
        >
          Hubungkan ke Nakes
        </Text>
        <Text
          style={{
            ...typography.body,
            color: colors.textSecondary,
            marginTop: spacing.xs,
          }}
        >
          Tunjukkan kode ini kepada Nakes agar mereka dapat menghubungkan akun
          Anda.
        </Text>

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

        <View
          style={{
            marginTop: spacing.xl,
            padding: spacing.lg,
            alignItems: 'center',
            borderRadius: radius.lg,
            backgroundColor: colors.surface,
            shadowColor: colors.primaryDark,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : !isPatient ? (
            <Text
              style={{
                ...typography.body,
                color: colors.textSecondary,
                textAlign: 'center',
              }}
            >
              Fitur ini hanya tersedia untuk akun pasien.
            </Text>
          ) : status?.connected ? (
            <>
              <Text style={{ ...typography.caption, color: colors.textSecondary }}>
                Akun Anda sudah terhubung dengan
              </Text>
              <Text
                style={{
                  ...typography.h1,
                  color: colors.primary,
                  marginTop: spacing.sm,
                  textAlign: 'center',
                }}
              >
                {status.nakes?.namaLengkap || 'Nakes'}
              </Text>
            </>
          ) : (
            <>
              <Text style={{ ...typography.bodyMedium, color: colors.textPrimary }}>
                Kode penghubung pasien
              </Text>
              {code && secondsRemaining > 0 ? (
                <>
                  <Text
                    accessibilityLabel={`Kode ${code}`}
                    selectable
                    style={{
                      color: colors.primaryDark,
                      fontSize: 40,
                      fontWeight: '700',
                      letterSpacing: 10,
                      marginTop: spacing.md,
                    }}
                  >
                    {code}
                  </Text>
                  <Text
                    style={{
                      ...typography.caption,
                      color: colors.textSecondary,
                      marginTop: spacing.xs,
                    }}
                  >
                    Kode berlaku {formatRemaining(secondsRemaining)} lagi
                  </Text>
                </>
              ) : (
                <Text
                  style={{
                    ...typography.body,
                    color: colors.textSecondary,
                    marginTop: spacing.md,
                    textAlign: 'center',
                  }}
                >
                  Buat kode 6 digit yang berlaku selama 10 menit.
                </Text>
              )}
              <TouchableOpacity
                accessibilityRole="button"
                disabled={generating}
                onPress={handleCreateCode}
                style={{
                  minHeight: 48,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  marginTop: spacing.lg,
                  borderRadius: radius.md,
                  backgroundColor: generating ? colors.disabled : colors.primary,
                }}
              >
                {generating ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={{ ...typography.button, color: colors.white }}>
                    {code && secondsRemaining > 0 ? 'Buat kode baru' : 'Buat kode'}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
