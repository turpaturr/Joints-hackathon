import { colors, radius, spacing, typography } from '@/theme';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export function ProfileHeader() {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return (
    <View style={{ gap: spacing.md }}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Kembali ke dashboard"
        onPress={goBack}
        activeOpacity={0.7}
        style={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.full,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <ChevronLeft size={22} color={colors.textPrimary} />
      </TouchableOpacity>

      <View>
        <Text style={{ ...typography.display, color: colors.textPrimary }}>
          Profil Saya
        </Text>
        <Text
          style={{
            ...typography.body,
            color: colors.textSecondary,
            marginTop: spacing.xs,
          }}
        >
          Informasi akun dan tenaga kesehatan yang menangani Anda.
        </Text>
      </View>
    </View>
  );
}