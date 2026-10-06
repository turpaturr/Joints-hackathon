import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { colors, radius, spacing, typography } from "@/theme";
import { router } from "expo-router";
import { HeartPulse } from "lucide-react-native";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/");
    }, 300);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: spacing.screenPadding,
          paddingVertical: spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
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
              textAlign: "center",
              marginTop: spacing.xs,
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

        {/* Form fields */}
        <View style={{ marginTop: spacing.lg}}>
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
    </SafeAreaView>
  );
}