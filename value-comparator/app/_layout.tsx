import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, Mitr_600SemiBold } from "@expo-google-fonts/mitr";
import { Sarabun_400Regular } from "@expo-google-fonts/sarabun";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";

import { useComparatorStore } from "../src/store/comparatorStore";
import { getAppColors } from "../src/theme/colors";

import "../global.css";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error */
});

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const theme = useComparatorStore((state) => state.theme);
  const activeColors = getAppColors(theme, systemColorScheme);

  const [fontsLoaded, fontError] = useFonts({
    Mitr_600SemiBold,
    Sarabun_400Regular,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {
        /* ignore error */
      });
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const isLightMode =
    theme === "light" || (theme === "system" && systemColorScheme === "light");

  return (
    <SafeAreaProvider>
      <StatusBar style={isLightMode ? "dark" : "light"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: activeColors.bg },
        }}
      />
    </SafeAreaProvider>
  );
}
