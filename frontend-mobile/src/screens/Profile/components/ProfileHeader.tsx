import { colors, spacing, typography } from '@/theme';
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
    <View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Kembali ke dashboard"
        onPress={goBack}
        style={{
          minHeight: spacing.xxl,
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: spacing.md,
          marginBottom: spacing.md,
        }}
      >
        <ChevronLeft size={24} color={colors.primary} />
        <Text
          style={{
            ...typography.bodyMedium,
            color: colors.primary,
            marginLeft: spacing.xs,
          }}
        >
          Kembali
        </Text>
      </TouchableOpacity>

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
  );
}
