import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress: () => void;
  /** Tandai sebagai aksi paling relevan hari ini (dot accentTeal). */
  highlight?: boolean;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  onPress,
  highlight = false,
}: FeatureCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Ikon dalam soft container */}
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: radius.md,
          backgroundColor: colors.bgBase,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={32} color={colors.primary} strokeWidth={2} />
      </View>

      {/* Teks */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          <Text style={{ ...typography.h2, color: colors.textPrimary }}>
            {title}
          </Text>

          {highlight ? (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: radius.full,
                backgroundColor: colors.accentTeal,
              }}
            />
          ) : null}
        </View>

        <Text
          style={{
            ...typography.caption,
            color: colors.textSecondary,
            marginTop: 2,
          }}
        >
          {description}
        </Text>
      </View>

      {/* Chevron */}
      <ChevronRight size={20} color={colors.primary} strokeWidth={2.2} />
    </TouchableOpacity>
  );
}