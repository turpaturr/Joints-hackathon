import { colors, radius, spacing, typography } from '@/theme';
import { HeartPulse } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
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
    <View style={[cardStyle, styles.card]}>
      {/* Avatar with soft ring */}
      <View style={styles.avatarRing}>
        <View style={styles.avatar}>
          <Text style={styles.initials} allowFontScaling={false}>
            {initials}
          </Text>
        </View>
      </View>

      {/* Identity */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.email} numberOfLines={1} ellipsizeMode="middle">
          {email}
        </Text>

        <View style={styles.badge}>
          <HeartPulse size={15} color={colors.primaryDark} />
          <Text style={styles.badgeText}>Akun pasien</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  avatarRing: {
    width: 68,
    height: 68,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.accentLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.display,
    fontSize: 22,
    lineHeight: 28,
    color: colors.white,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  email: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.accentLime,
  },
  badgeText: {
    ...typography.label,
    fontSize: 13,
    color: colors.primaryDark,
  },
});