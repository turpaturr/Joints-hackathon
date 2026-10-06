import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  let backgroundColor = colors.primary;
  let textColor = '#FFFFFF';
  let borderWidth = 0;
  let borderColor = 'transparent';

  if (variant === 'secondary') {
    backgroundColor = 'transparent';
    textColor = colors.primary;
    borderWidth = 1.5;
    borderColor = colors.primary;
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    textColor = colors.primary;
  }

  if (disabled) {
    backgroundColor = colors.disabled;
    textColor = '#FFFFFF';
    borderWidth = 0;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        height: 52, // Spesifikasi 7.1 DESIGN.md[cite: 1]
        borderRadius: radius.md,
        backgroundColor,
        borderWidth,
        borderColor,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        width: '100%',
      }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ ...typography.button, color: textColor }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};