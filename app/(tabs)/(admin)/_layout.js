import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AdminLayout() {
  const router = useRouter();

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
        headerStyle: { backgroundColor: "#0f0f0f" },
        headerTintColor: "#00c030",
        headerTitleStyle: { color: "#fff", fontWeight: "bold" },
        contentStyle: { backgroundColor: "#0f0f0f" },
        headerLeft: () => (
          <TouchableOpacity onPress={handleBack} style={{ marginRight: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#00c030" />
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
    </Stack>
  );
}
