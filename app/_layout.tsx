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
import { Provider } from "react-redux";
import { store } from "@/core/redux";

export const unstable_settings = {
  anchor: "(tabs)",
};

/**
 * AuthGate — protège les routes selon l'état d'auth.
 *
 * - Pendant qu'on lit SecureStore (isInitializing) → on ne fait rien
 * - Pendant un login/register/me en cours (isLogging) → on ne fait rien
 * - Si pas connecté et on N'EST PAS sur login/register → redirige vers login
 * - Si connecté et on EST sur login/register → redirige vers la home
 */
function AuthGate() {
  const { isAuthenticated, isInitializing, isLogging } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navState = useRootNavigationState();

  useEffect(() => {
    // Attendre que le navigator soit monté
    if (!navState?.key) return;

    // Attendre la fin de la lecture du token et de useMeQuery
    if (isInitializing || isLogging) return;

    const first = segments[0];
    const inAuthRoute = first === "login" || first === "register";

    if (!isAuthenticated && !inAuthRoute) {
      router.replace("/login");
    } else if (isAuthenticated && inAuthRoute) {
      router.replace("/(tabs)");
    }
  }, [
    isAuthenticated,
    isInitializing,
    isLogging,
    segments,
    router,
    navState?.key,
  ]);

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
