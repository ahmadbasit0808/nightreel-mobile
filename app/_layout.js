import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../lib/AuthContext";
import { ThemeProvider, useTheme } from "../lib/ThemeContext";
import { useOTAUpdate } from "../lib/useOTAUpdate";

function RootStack() {
  const { theme, mode } = useTheme();
  useOTAUpdate();
  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.bg },
          headerTintColor: theme.accent,
          headerTitleStyle: { color: theme.text, fontWeight: "bold" },
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ title: "Sign In" }} />
        <Stack.Screen name="(auth)/signup" options={{ title: "Create Account" }} />
        <Stack.Screen name="movies/[id]" options={{ title: "Movie" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </ThemeProvider>
  );
}
