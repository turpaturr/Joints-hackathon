import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ApiError } from "@/services/api";
import { register } from "@/services/AuthServices/auth.service";
import { colors, spacing, typography } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Semua kolom wajib diisi");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({
        email,
        password,
        namaLengkap: fullName,
        role: "PATIENT",
      });
      router.replace("/auth/Login");
    } catch (err) {
      if (err instanceof ApiError || (err as any)?.name === "ApiError") {
        setError((err as any).message);
      } else {
        setError("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.screenPadding,
            paddingVertical: spacing.xl,
            paddingBottom: spacing.xxl,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
        {/* Brand */}
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("@/assets/images/Connect.png")}
            accessibilityLabel="Logo Connect"
            resizeMode="contain"
            style={{ width: 176, height: 176 }}
          />
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
              textAlign: "center",
              marginTop: spacing.sm,
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
            flexDirection: "row",
            justifyContent: "center",
            marginTop: spacing.xl,
          }}
        >
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            Sudah punya akun?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth/Login")}
            activeOpacity={0.7}
          >
            <Text style={{ ...typography.bodyMedium, color: colors.primary }}>
              Masuk
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
