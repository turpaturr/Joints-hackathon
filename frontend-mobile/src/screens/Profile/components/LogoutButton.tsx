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
      activeOpacity={0.7}
      style={{
        minHeight: spacing.xxl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.sm,
        borderRadius: radius.full,
      }}
    >
      <LogOut size={18} color={colors.danger} />
      <Text
        style={{
          ...typography.button,
          color: colors.danger,
          marginLeft: spacing.sm,
        }}
      >
        Keluar
      </Text>
    </TouchableOpacity>
  );
}