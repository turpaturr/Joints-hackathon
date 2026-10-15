import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  onPress: () => void;
  highlight?: boolean;
  accentColor?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  onPress,
  highlight = false,
  accentColor = colors.primary,
}: FeatureCardProps) {
  const activeAccent = highlight ? colors.primary : accentColor;

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
        overflow: 'hidden',
        borderLeftWidth: 4,
        borderLeftColor: activeAccent,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: radius.md,
          backgroundColor: `${activeAccent}15`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={32} color={activeAccent} strokeWidth={2} />
      </View>

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

          {highlight && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: radius.full,
                backgroundColor: colors.accentTeal, // Set explicitly to accentTeal
              }}
            />
          )}
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

      {/* Chevron matching accent */}
      <ChevronRight size={20} color={activeAccent} strokeWidth={2.2} />
    </TouchableOpacity>
  );
}