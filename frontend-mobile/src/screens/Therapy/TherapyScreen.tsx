import { colors, radius, spacing, typography } from '@/theme';
import { router } from 'expo-router';
import { ArrowLeft, Smartphone, Video } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import komponen mode yang akan kita buat
import { GyroscopeMode } from './GyroscopeMode';
import { CameraMode } from './CameraMode';

type TherapyMode = 'menu' | 'gyroscope' | 'camera';

export default function TherapyScreen() {
  const [activeMode, setActiveMode] = useState<TherapyMode>('menu');

  // Jika mode gyro dipilih, render komponen GyroscopeMode
  if (activeMode === 'gyroscope') {
    return <GyroscopeMode onBack={() => setActiveMode('menu')} />;
  }

  // Jika mode kamera dipilih, render komponen CameraMode
  if (activeMode === 'camera') {
    return <CameraMode onBack={() => setActiveMode('menu')} />;
  }

  // Tampilan Menu Utama
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={{ ...typography.h1, color: colors.textPrimary }}>
          Pilih Mode Terapi
        </Text>
        <Text style={styles.subtitle}>
          Metode apa yang ingin Anda gunakan untuk sesi latihan hari ini?
        </Text>

        <View style={styles.menuContainer}>
          {/* Tombol Mode Gyroscope */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => setActiveMode('gyroscope')}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
              <Smartphone size={32} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={{ ...typography.h2, color: colors.textPrimary }}>
                Sensor Gerak (Gyroscope)
              </Text>
              <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: 4 }}>
                Ukur sudut kemiringan menggunakan sensor di HP Anda.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Tombol Mode Kamera */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => setActiveMode('camera')}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.accentTeal + '20' }]}>
              <Video size={32} color={colors.accentTeal} />
            </View>
            <View style={styles.cardText}>
              <Text style={{ ...typography.h2, color: colors.textPrimary }}>
                Rekaman Visual (Kamera)
              </Text>
              <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: 4 }}>
                Rekam gerakan Anda untuk dievaluasi oleh dokter.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgBase },
  header: { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.md },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -spacing.sm },
  content: { flex: 1, paddingHorizontal: spacing.screenPadding, paddingTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xl },
  menuContainer: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: { width: 64, height: 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1, marginLeft: spacing.md },
});