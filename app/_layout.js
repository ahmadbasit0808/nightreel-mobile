import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../lib/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0f0f0f" },
          headerTintColor: "#00c030",
          headerTitleStyle: { color: "#fff", fontWeight: "bold" },
          contentStyle: { backgroundColor: "#0f0f0f" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ title: "Sign In" }} />
        <Stack.Screen name="(auth)/signup" options={{ title: "Create Account" }} />
        <Stack.Screen name="movies/[id]" options={{ title: "Movie" }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
