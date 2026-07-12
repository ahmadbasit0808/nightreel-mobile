import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../lib/AuthContext";

export default function TabsLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#1a1a1a", borderTopColor: "#333" },
        tabBarActiveTintColor: "#00c030",
        tabBarInactiveTintColor: "#888",
        headerStyle: { backgroundColor: "#0f0f0f" },
        headerTintColor: "#fff",
        headerTitleStyle: { color: "#fff", fontWeight: "bold" },
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(admin)"
        options={{
          title: "Admin",
          headerShown: false, // 👈 add this
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-outline" color={color} size={size} />
          ),
          tabBarItemStyle: { display: user?.isadmin ? "flex" : "none" },
        }}
      />
    </Tabs>
  );
}
