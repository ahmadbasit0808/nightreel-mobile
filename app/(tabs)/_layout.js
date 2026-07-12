import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { useTheme } from "../../lib/ThemeContext";

function AvatarButton() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) return null;
  return (
    <TouchableOpacity style={styles.avatar} onPress={() => router.push("/profile")}>
      <Text style={styles.avatarText}>{user.username?.[0]?.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: "#00c030",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

export default function TabsLayout() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.card2, borderTopColor: theme.border2 },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.subtext,
        headerStyle: { backgroundColor: theme.bg },
        headerTintColor: theme.accent,
        headerTitleStyle: { color: theme.text, fontWeight: "bold" },
        headerRight: () => <AvatarButton />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: "Movies",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="topmovies"
        options={{
          title: "Top Rated",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/settings")} style={{ marginRight: 12 }}>
              <Ionicons name="settings-outline" size={22} color={theme.subtext} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          href: null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(admin)"
        options={{
          title: "Admin",
          headerShown: false,
          href: user?.isadmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
