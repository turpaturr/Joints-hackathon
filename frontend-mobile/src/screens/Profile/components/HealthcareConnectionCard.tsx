import type { PatientConnectionStatus } from '@/services/connection.service';
import { colors, radius, spacing, typography } from '@/theme';
import { RefreshCw } from 'lucide-react-native';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { cardStyle } from './CardStyle';

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
    <View style={{ ...cardStyle, padding: spacing.md }}>
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
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.full,
            backgroundColor: colors.bgBase,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <RefreshCw size={18} color={colors.primary} />
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
  const nakesName = status.nakes?.namaLengkap || 'Nakes terhubung';

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
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.full,
            backgroundColor: colors.accentLime,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
          }}
        >
          <Text style={{ ...typography.h2, color: colors.primaryDark }}>
            {nakesName.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...typography.bodyMedium, color: colors.textPrimary }}>
            {nakesName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: spacing.xs,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: radius.full,
                backgroundColor: colors.primary,
                marginRight: spacing.xs + 2,
              }}
            />
            <Text style={{ ...typography.caption, color: colors.textSecondary }}>
              Terhubung
            </Text>
          </View>
        </View>
      </View>

      {details.length ? (
        <View
          style={{
            marginTop: spacing.md,
            paddingTop: spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            gap: spacing.sm + 2,
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
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        borderRadius: radius.md,
        backgroundColor: colors.bgBase,
      }}
    >
      <Text
        style={{
          ...typography.caption,
          color: colors.textSecondary,
          textAlign: 'center',
        }}
      >
        Tunjukkan kode ini kepada Nakes untuk menghubungkan akun.
      </Text>
      {code ? (
        <>
          <View
            accessible
            accessibilityLabel={`Kode koneksi ${code}`}
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: spacing.sm,
              marginTop: spacing.md,
            }}
          >
            {code.split('').map((char, i) => (
              <View
                key={`${char}-${i}`}
                style={{
                  width: 40,
                  height: 52,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: radius.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ ...typography.h1, color: colors.primaryDark }}>
                  {char}
                </Text>
              </View>
            ))}
          </View>
          {secondsRemaining > 0 ? (
            <View
              style={{
                marginTop: spacing.md,
                paddingHorizontal: spacing.sm + 2,
                paddingVertical: spacing.xs,
                borderRadius: radius.full,
                backgroundColor: colors.surface,
              }}
            >
              <Text style={{ ...typography.caption, color: colors.textSecondary }}>
                Berlaku {formatRemaining(secondsRemaining)} lagi
              </Text>
            </View>
          ) : (
            <Text
              accessibilityRole="alert"
              style={{
                ...typography.caption,
                color: colors.danger,
                marginTop: spacing.md,
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