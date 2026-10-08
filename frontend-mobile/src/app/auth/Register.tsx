import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { colors, radius, spacing, typography } from '@/theme';
import { router } from 'expo-router';
import { HeartPulse } from 'lucide-react-native';
import { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '@/services/api';
import { register } from '@/services/auth.service';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Semua kolom wajib diisi');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ email, password, namaLengkap: fullName, role: 'PATIENT' });
      router.replace('/auth/Login');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: spacing.screenPadding,
          paddingVertical: spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
           <HeartPulse size={28} color="#FFFFFF" strokeWidth={2.2} />
          </View>

          <Text
            style={{
              ...typography.h2,
              color: colors.textPrimary,
              marginTop: spacing.md,
            }}
          >
            Connect
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: spacing.xs,
            }}
          >
            Teman setia Anda menjalani terapi mandiri di rumah.
          </Text>
        </View>

        {/* Greeting */}
        <View style={{ marginTop: spacing.xl }}>
          <Text style={{ ...typography.h1, color: colors.textPrimary }}>
            Buat akun
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
              marginTop: spacing.xs,
            }}
          >
            Mulai langkah awal terapi dan pemulihan Anda.
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <Text
            style={{
              ...typography.caption,
              color: colors.danger,
              marginTop: spacing.md,
            }}
          >
            {error}
          </Text>
        ) : null}

        {/* Form fields */}
        <View style={{ marginTop: spacing.lg }}>
          <Input
            label="Nama Lengkap Pasien"
            placeholder="Contoh: Budi Santoso"
            value={fullName}
            onChangeText={setFullName}
          />
          <Input
            label="Email"
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Kata Sandi"
            placeholder="Buat kata sandi aman"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
          <Input
            label="Konfirmasi Kata Sandi"
            placeholder="Ulangi kata sandi"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />
        </View>

        {/* CTA */}
        <View style={{ marginTop: spacing.lg }}>
          <Button title="Daftar" onPress={handleRegister} loading={loading} />
        </View>

        {/* Footer */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: spacing.xl,
          }}
        >
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            Sudah punya akun?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/auth/Login')}
            activeOpacity={0.7}
          >
            <Text style={{ ...typography.bodyMedium, color: colors.primary }}>
              Masuk
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}