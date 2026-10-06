import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import { HeartPulse } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.replace('/');
    }, 1200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <ScrollView 
        contentContainerStyle={{ 
          paddingHorizontal: spacing.screenPadding, 
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl,
          flexGrow: 1,
          justifyContent: 'center'
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Icon Header */}
        <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
          <View style={{
            width: 56,
            height: 56,
            borderRadius: radius.full,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.sm,
            // Shadow halus sesuai section 6 DESIGN.md
            shadowColor: colors.primaryDark,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 3,
          }}>
            <HeartPulse size={28} color="#FFFFFF" />
          </View>
          
          <Text style={{ ...typography.display, color: colors.primaryDark, textAlign: 'center' }}>
            CONNECT
          </Text>
          
          {/* Badge Aksen Sesuai Aturan 7.5 */}
          <View style={{
            backgroundColor: '#E6F7FF',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: radius.full,
            marginTop: spacing.xs,
          }}>
            <Text style={{ ...typography.caption, color: colors.primary, fontFamily: 'Poppins_600SemiBold' }}>
              Aplikasi Terapi Mandiri
            </Text>
          </View>
        </View>

        {/* Card Container Utama (Surface) */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg, // 16px
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}>
          <Text style={{ ...typography.h1, color: colors.textPrimary, marginBottom: 4 }}>
            Selamat Datang
          </Text>
          <Text style={{ ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg }}>
            Masuk untuk melanjutkan terapi Anda.
          </Text>

          {/* Banner Alert Error */}
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

          {/* Form Fields */}
          <Input
            label="Email / Rekam Medis"
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Kata Sandi"
            placeholder="Masukkan kata sandi"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <TouchableOpacity 
            style={{ alignSelf: 'flex-end', marginBottom: spacing.lg }}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Text style={{ ...typography.caption, color: colors.primary, fontFamily: 'Poppins_500Medium' }}>
              Lupa Kata Sandi?
            </Text>
          </TouchableOpacity>

          <Button title="Masuk Ke Aplikasi" onPress={handleLogin} loading={loading} />
        </View>

        {/* Link Ke Register */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl }}>
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            Belum punya akun?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/Register')} activeOpacity={0.7}>
            <Text style={{ ...typography.bodyMedium, color: colors.primary }}>
              Daftar Sekarang
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}