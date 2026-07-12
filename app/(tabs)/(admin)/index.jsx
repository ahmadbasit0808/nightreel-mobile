import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { adminAPI } from "../../../lib/api";
import { useAuth } from "../../../lib/AuthContext";
import { useTheme } from "../../../lib/ThemeContext";

const STATS = [
  { key: ["totalusers", "totalUsers"], label: "Users", icon: "people", route: "/(admin)/users" },
  { key: ["totalmovies", "totalMovies"], label: "Movies", icon: "film", route: "/(admin)/movies" },
];

export default function AdminScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await adminAPI.getDashboard();
      setStats(res.data);
    } catch (err) {
      console.log("Dashboard error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getValue = (keys) => {
    for (const k of keys) if (stats[k] != null) return stats[k];
    return 0;
  };

  if (loading) return <ActivityIndicator color={theme.accent} style={{ marginTop: 60, flex: 1, backgroundColor: theme.bg }} />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.welcome, { color: theme.subtext }]}>Welcome back, {user?.username} 👋</Text>
      <View style={styles.grid}>
        {STATS.map(({ key, label, icon, route }) => (
          <TouchableOpacity key={label} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.push(route)}>
            <View style={[styles.cardIcon, { backgroundColor: theme.accent + "22" }]}>
              <Ionicons name={icon} size={20} color={theme.accent} />
            </View>
            <Text style={[styles.cardNum, { color: theme.accent }]}>{getValue(key)}</Text>
            <Text style={[styles.cardLabel, { color: theme.subtext }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Quick Actions</Text>
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.push("/(admin)/add-movie")}>
        <View style={styles.actionLeft}>
          <Ionicons name="add-circle-outline" size={22} color={theme.accent} />
          <Text style={[styles.actionText, { color: theme.text }]}>Add New Movie</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.subtext} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  content: { padding: 16, paddingBottom: 40 },

  welcome: { color: "#888", fontSize: 13, marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 },
  card: {
    width: "47%", backgroundColor: "#141414", borderRadius: 14,
    padding: 18, borderWidth: 1, borderColor: "#222",
  },
  cardIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: "#0d2b1a",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
  },
  cardNum: { color: "#00c030", fontSize: 28, fontWeight: "bold" },
  cardLabel: { color: "#888", fontSize: 13, marginTop: 2 },

  sectionTitle: { color: "#555", fontSize: 12, fontWeight: "600", marginBottom: 10, letterSpacing: 1 },
  actionBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#141414", borderRadius: 12, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: "#222",
  },
  actionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  actionText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
