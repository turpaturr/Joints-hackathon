import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={{ 
        ...typography.label, 
        color: colors.textPrimary, 
        marginBottom: spacing.xs,
        letterSpacing: 0.2
      }}>
        {label}
      </Text>
      
      <View
        style={{
          height: 48, // Sesuai spesifikasi 7.3 DESIGN.md
          borderRadius: radius.sm, // 8px
          borderWidth: isFocused ? 1.5 : 1,
          borderColor: error ? colors.danger : isFocused ? colors.primary : colors.border,
          backgroundColor: isFocused ? colors.surface : '#F1F5F8', // Latar lebih subtle saat tidak fokus
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            ...typography.body,
            color: colors.textPrimary,
            height: '100%',
          }}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOff size={18} color={colors.textSecondary} />
            ) : (
              <Eye size={18} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={{ ...typography.caption, color: colors.danger, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
};