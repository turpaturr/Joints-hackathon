import { colors, radius, spacing, typography } from '@/theme';
import { HeartPulse } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { cardStyle } from './CardStyle';

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
        ...cardStyle,
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
      }}
    >
      {/* Avatar with soft ring */}
      <View
        style={{
          width: 92,
          height: 92,
          borderRadius: radius.full,
          borderWidth: 2,
          borderColor: colors.accentLime,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: radius.full,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ ...typography.display, color: colors.white }}>
            {initials}
          </Text>
        </View>
      </View>

      <Text
        style={{
          ...typography.h2,
          color: colors.textPrimary,
          marginTop: spacing.md,
          textAlign: 'center',
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          ...typography.caption,
          color: colors.textSecondary,
          marginTop: spacing.xs,
          textAlign: 'center',
        }}
      >
        {email}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: spacing.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs + 2,
          borderRadius: radius.full,
          backgroundColor: colors.accentLime,
        }}
      >
        <HeartPulse size={14} color={colors.primaryDark} />
        <Text
          style={{
            ...typography.label,
            color: colors.primaryDark,
            marginLeft: spacing.xs + 2,
          }}
        >
          Akun pasien
        </Text>
      </View>
    </View>
  );
}