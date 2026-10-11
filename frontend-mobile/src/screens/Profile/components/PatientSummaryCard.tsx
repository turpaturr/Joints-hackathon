import { colors, radius, spacing, typography } from '@/theme';
import { HeartPulse } from 'lucide-react-native';
import { Text, View } from 'react-native';

interface PatientSummaryCardProps {
  name: string;
  email: string;
  initials: string;
}

export function PatientSummaryCard({
  name,
  email,
  initials,
}: PatientSummaryCardProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
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
          width: spacing.xxl,
          height: spacing.xxl,
          borderRadius: radius.full,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}
      >
        <Text style={{ ...typography.h1, color: colors.white }}>{initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ ...typography.h2, color: colors.textPrimary }}>{name}</Text>
        <Text
          style={{
            ...typography.caption,
            color: colors.textSecondary,
            marginTop: spacing.xs,
          }}
        >
          {email}
        </Text>
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.sm,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: radius.full,
            backgroundColor: colors.accentLime,
          }}
        >
          <HeartPulse size={24} color={colors.primaryDark} />
          <Text
            style={{
              ...typography.label,
              color: colors.primaryDark,
              marginLeft: spacing.xs,
            }}
          >
            Akun pasien
          </Text>
        </View>
      </View>
    </View>
  );
}
