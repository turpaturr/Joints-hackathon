import type { PatientConnectionStatus } from '@/services/connection.service';
import { colors, radius, spacing, typography } from '@/theme';
import { RefreshCw, Stethoscope } from 'lucide-react-native';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface HealthcareConnectionCardProps {
  status: PatientConnectionStatus | null;
  code: string;
  secondsRemaining: number;
  loading: boolean;
  generating: boolean;
  onRefresh: () => void;
}

function formatRemaining(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function getNakesDetails(status: PatientConnectionStatus) {
  const nakes = status.nakes;
  if (!nakes) return [];

  return [
    ['Email', nakes.email || nakes.user?.email],
    ['Nomor telepon', nakes.nomorTelepon || nakes.nakesProfile?.nomorTelepon],
    ['Spesialisasi', nakes.spesialisasi || nakes.nakesProfile?.spesialisasi],
    ['Fasilitas kesehatan', nakes.faskes || nakes.nakesProfile?.faskes],
    ['Nomor registrasi', nakes.nomorRegis || nakes.nakesProfile?.nomorRegis],
  ].filter((item): item is [string, string] => Boolean(item[1]));
}

export function HealthcareConnectionCard({
  status,
  code,
  secondsRemaining,
  loading,
  generating,
  onRefresh,
}: HealthcareConnectionCardProps) {
  const nakesDetails = status ? getNakesDetails(status) : [];

  return (
    <View
      style={{
        marginTop: spacing.lg,
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ ...typography.h2, color: colors.textPrimary }}>
            Tenaga kesehatan
          </Text>
          <Text
            style={{
              ...typography.caption,
              color: colors.textSecondary,
              marginTop: spacing.xs,
            }}
          >
            {status?.connected
              ? 'Profil Nakes yang terhubung dengan akun Anda.'
              : 'Akun Anda belum terhubung dengan Nakes.'}
          </Text>
        </View>
        <TouchableOpacity
          accessibilityLabel="Perbarui status koneksi"
          accessibilityRole="button"
          disabled={loading}
          onPress={onRefresh}
          style={{
            width: spacing.xxl,
            height: spacing.xxl,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.md,
            backgroundColor: colors.bgBase,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <RefreshCw size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          color={colors.primary}
          style={{ marginTop: spacing.lg }}
        />
      ) : status?.connected ? (
        <ConnectedNakesDetails status={status} details={nakesDetails} />
      ) : (
        <ConnectionCode
          code={code}
          secondsRemaining={secondsRemaining}
          generating={generating}
        />
      )}
    </View>
  );
}

function ConnectedNakesDetails({
  status,
  details,
}: {
  status: PatientConnectionStatus;
  details: [string, string][];
}) {
  return (
    <View
      style={{
        marginTop: spacing.md,
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.bgBase,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Stethoscope size={24} color={colors.primary} />
        <Text
          style={{
            ...typography.bodyMedium,
            color: colors.textPrimary,
            marginLeft: spacing.sm,
            flex: 1,
          }}
        >
          {status.nakes?.namaLengkap || 'Nakes terhubung'}
        </Text>
      </View>
      {details.length ? (
        <View
          style={{
            marginTop: spacing.sm,
            paddingTop: spacing.sm,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            gap: spacing.sm,
          }}
        >
          {details.map(([label, value]) => (
            <View
              key={label}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: spacing.md,
              }}
            >
              <Text style={{ ...typography.caption, color: colors.textSecondary }}>
                {label}
              </Text>
              <Text
                style={{
                  ...typography.caption,
                  color: colors.textPrimary,
                  flexShrink: 1,
                  textAlign: 'right',
                }}
              >
                {value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function ConnectionCode({
  code,
  secondsRemaining,
  generating,
}: {
  code: string;
  secondsRemaining: number;
  generating: boolean;
}) {
  return (
    <View
      style={{
        marginTop: spacing.md,
        padding: spacing.md,
        alignItems: 'center',
        borderRadius: radius.md,
        backgroundColor: colors.bgBase,
      }}
    >
      <Text style={{ ...typography.caption, color: colors.textSecondary }}>
        Tunjukkan kode ini kepada Nakes untuk menghubungkan akun.
      </Text>
      {code ? (
        <>
          <Text
            accessibilityLabel={`Kode koneksi ${code}`}
            selectable
            style={{
              ...typography.h1,
              color: colors.primaryDark,
              letterSpacing: spacing.xs,
              marginTop: spacing.sm,
            }}
          >
            {code}
          </Text>
          {secondsRemaining > 0 ? (
            <Text
              style={{
                ...typography.caption,
                color: colors.textSecondary,
                marginTop: spacing.xs,
              }}
            >
              Kode berlaku {formatRemaining(secondsRemaining)} lagi
            </Text>
          ) : (
            <Text
              accessibilityRole="alert"
              style={{
                ...typography.caption,
                color: colors.danger,
                marginTop: spacing.xs,
                textAlign: 'center',
              }}
            >
              Kode sudah kedaluwarsa. API saat ini hanya menyediakan kode
              sementara.
            </Text>
          )}
        </>
      ) : generating ? (
        <ActivityIndicator
          color={colors.primary}
          style={{ marginTop: spacing.md }}
        />
      ) : (
        <Text
          style={{
            ...typography.caption,
            color: colors.textSecondary,
            marginTop: spacing.sm,
            textAlign: 'center',
          }}
        >
          Kode belum tersedia. Perbarui status untuk mencoba lagi.
        </Text>
      )}
    </View>
  );
}
