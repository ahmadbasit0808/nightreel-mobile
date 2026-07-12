import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../../lib/ThemeContext";

export default function AdminLayout() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/admin");
    }
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.bg },
        headerTintColor: theme.accent,
        headerTitleStyle: { color: theme.text, fontWeight: "bold" },
        contentStyle: { backgroundColor: theme.bg },
        headerLeft: () => (
          <TouchableOpacity onPress={handleBack} style={{ marginRight: 8 }}>
            <Ionicons name="arrow-back" size={24} color={theme.accent} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Admin Dashboard", headerLeft: () => null }}
      />
      <Stack.Screen name="movies" options={{ title: "Manage Movies" }} />
      <Stack.Screen name="add-movie" options={{ title: "Add Movie" }} />
      <Stack.Screen name="edit-movie" options={{ title: "Edit Movie" }} />
      <Stack.Screen name="users" options={{ title: "All Users" }} />
    </Stack>
  );
}
