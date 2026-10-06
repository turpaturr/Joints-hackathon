import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 bg-bgBase">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        
        {/* ===== HEADER DENGAN CURVE SVG (Sesuai Layout Gambar + Warna DESIGN.md) ===== */}
        <View className="relative bg-primaryDark pt-14 pb-16 items-center justify-center">
          {/* Logo Aplikasi Connect */}
          <View className="w-20 h-20 bg-surface rounded-full items-center justify-center mb-2">
            <Ionicons name="pulse" size={44} color="#1679AB" />
          </View>
          <Text className="text-surface font-poppins-bold text-2xl tracking-wide">
            CONNECT
          </Text>

          {/* Svg Lengkungan Bawah (Wave/Curve) */}
          <View className="absolute -bottom-1 left-0 right-0">
            <Svg viewBox="0 0 1440 320" width="100%" height={50} preserveAspectRatio="none">
              <Path
                fill="#F7FAFC" // Menyesuaikan warna bgBase (#F7FAFC)
                d="M0,192L80,181.3C160,171,320,149,480,160C640,171,800,213,960,213.3C1120,213,1280,171,1360,149.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
              />
            </Svg>
          </View>
        </View>

        {/* ===== FORM CONTAINER ===== */}
        <View className="flex-1 px-5 pt-4 pb-8 justify-between">
          <View>
            {/* Title Section (display: 28px/SemiBold dari DESIGN.md) */}
            <Text className="text-[28px] leading-[36px] font-poppins-semibold text-textPrimary mb-1">
              Selamat Datang!
            </Text>
            <Text className="text-[15px] leading-[22px] font-poppins text-textSecondary mb-8">
              Silakan masuk ke akun Anda untuk melanjutkan terapi
            </Text>

            {/* Field: Email */}
            <View className="mb-4">
              <Text className="text-[12px] leading-[16px] font-poppins-medium text-textSecondary mb-2">
                Email
              </Text>
              <View
                className={`h-[48px] px-4 rounded-sm bg-surface border flex-row items-center justify-between ${
                  isFocusedEmail ? 'border-[1.5px] border-primary' : 'border-border'
                }`}
              >
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Masukkan email Anda"
                  placeholderTextColor="#5C7A91"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setIsFocusedEmail(true)}
                  onBlur={() => setIsFocusedEmail(false)}
                  className="flex-1 font-poppins text-[15px] text-textPrimary h-full"
                />
              </View>
            </View>

            {/* Field: Password */}
            <View className="mb-2">
              <Text className="text-[12px] leading-[16px] font-poppins-medium text-textSecondary mb-2">
                Kata Sandi
              </Text>
              <View
                className={`h-[48px] px-4 rounded-sm bg-surface border flex-row items-center justify-between ${
                  isFocusedPassword ? 'border-[1.5px] border-primary' : 'border-border'
                }`}
              >
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Masukkan kata sandi"
                  placeholderTextColor="#5C7A91"
                  secureTextEntry={!showPassword}
                  onFocus={() => setIsFocusedPassword(true)}
                  onBlur={() => setIsFocusedPassword(false)}
                  className="flex-1 font-poppins text-[15px] text-textPrimary h-full mr-2"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#5C7A91"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Lupa Password */}
            <TouchableOpacity className="align-self-end items-end mb-8">
              <Text className="text-[13px] font-poppins-medium text-primary">
                Lupa Kata Sandi?
              </Text>
            </TouchableOpacity>

            {/* Tombol Utama (Primary Button) */}
            <TouchableOpacity
              activeOpacity={0.85}
              className="h-[52px] bg-primary rounded-md items-center justify-center shadow-sm"
            >
              <Text className="text-[16px] leading-[20px] font-poppins-semibold text-surface">
                Masuk
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Sign Up */}
          <View className="flex-row justify-center items-center mt-8">
            <Text className="text-[15px] font-poppins text-textSecondary">
              Belum punya akun?{' '}
            </Text>
            <TouchableOpacity>
              <Text className="text-[15px] font-poppins-semibold text-primary">
                Daftar
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
    </KeyboardAvoidingView>
  );
}