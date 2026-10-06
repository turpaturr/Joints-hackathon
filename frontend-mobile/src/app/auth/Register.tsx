import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
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

    setTimeout(() => {
      setLoading(false);
      router.replace('/auth/Login');
    }, 1200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <ScrollView 
        contentContainerStyle={{ 
          paddingHorizontal: spacing.screenPadding, 
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
          flexGrow: 1,
          justifyContent: 'center'
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={{ ...typography.display, color: colors.primaryDark }}>
            Buat Akun Baru
          </Text>
          <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: 4 }}>
            Mulai langkah awal terapi dan pemulihan Anda bersama Connect.
          </Text>
        </View>

        {/* Form Card Surface */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}>
          {error ? (
            <View style={{
              backgroundColor: '#FDE8E8',
              padding: spacing.md,
              borderRadius: radius.sm,
              marginBottom: spacing.md,
              borderLeftWidth: 4,
              borderLeftColor: colors.danger,
            }}>
              <Text style={{ ...typography.caption, color: colors.danger }}>{error}</Text>
            </View>
          ) : null}

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

          <View style={{ marginTop: spacing.sm }}>
            <Button title="Daftar Akun" onPress={handleRegister} loading={loading} />
          </View>
        </View>

        {/* Footer Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl }}>
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            Sudah memiliki akun?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/Login')} activeOpacity={0.7}>
            <Text style={{ ...typography.bodyMedium, color: colors.primary }}>
              Masuk
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}