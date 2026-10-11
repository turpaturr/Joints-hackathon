import { colors, radius, spacing, typography } from '@/theme';
import { LogOut } from 'lucide-react-native';
import { Text, TouchableOpacity } from 'react-native';

interface LogoutButtonProps {
  onPress: () => void;
}

export function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={{
        minHeight: spacing.xxl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <LogOut size={24} color={colors.primary} />
      <Text
        style={{
          ...typography.button,
          color: colors.primary,
          marginLeft: spacing.sm,
        }}
      >
        Keluar
      </Text>
    </TouchableOpacity>
  );
}
