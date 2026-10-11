import { authStore } from "@/services/AuthServices/authStore";
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    useFonts,
} from "@expo-google-fonts/poppins";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    authStore.load().finally(() => setAuthLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded && authLoaded) SplashScreen.hideAsync();
  }, [loaded, authLoaded]);

  if (!loaded || !authLoaded) return null;

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
