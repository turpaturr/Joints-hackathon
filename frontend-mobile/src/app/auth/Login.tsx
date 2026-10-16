import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ApiError } from "@/services/api";
import { login } from "@/services/AuthServices/auth.service";
import { authStore } from "@/services/AuthServices/authStore";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await login({ email, password });
      await authStore.save(result.user, result.token);
      router.replace("/home");
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
            Masuk
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
              marginTop: spacing.xs,
            }}
          >
            Silakan masuk untuk melanjutkan.
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
        </View>

        {/* Ghost link */}
        <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.7}
          style={{
            alignSelf: "flex-end",
            marginTop: spacing.sm,
            paddingVertical: spacing.xs,
          }}
        >
          <Text style={{ ...typography.bodyMedium, color: colors.primary }}>
            Lupa Kata Sandi?
          </Text>
        </TouchableOpacity>

        {/* CTA */}
        <View style={{ marginTop: spacing.lg }}>
          <Button title="Masuk" onPress={handleLogin} loading={loading} />
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
            Belum punya akun?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth/Register")}
            activeOpacity={0.7}
          >
            <Text style={{ ...typography.bodyMedium, color: colors.primary }}>
              Daftar Sekarang
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
