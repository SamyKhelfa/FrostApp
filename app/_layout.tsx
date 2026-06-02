import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "@/core/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {Provider} from "react-redux";
import { store } from "@/core/redux";


export const unstable_settings = {
  anchor: "(tabs)",
};

function AuthGate() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navState = useRootNavigationState();

  // useEffect(() => {
  //   if (!navState?.key) return; // wait for the root navigator to mount

  //   const first = segments[0];
  //   const inAuthRoute = first === "login" || first === "register";

  //   if (!isAuthenticated && !inAuthRoute) {
  //     router.replace("/login");
  //   } else if (isAuthenticated && inAuthRoute) {
  //     router.replace("/(tabs)");
  //   }
  // }, [isAuthenticated, segments, router, navState?.key]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
      <Provider store={store}>

      <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="change-password" />
          <Stack.Screen name="subscription" />
          <Stack.Screen name="terms" />
          <Stack.Screen name="privacy" />
        </Stack>
        <AuthGate />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
      </Provider>

  );
}
