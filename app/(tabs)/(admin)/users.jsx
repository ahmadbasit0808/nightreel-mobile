import { useState, useCallback } from "react";
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { adminAPI } from "../../../lib/api";
import { useTheme } from "../../../lib/ThemeContext";

export default function AdminUsersScreen() {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      adminAPI.getUsers()
        .then((res) => setUsers(res.data?.users ?? res.data ?? []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [])
  );

  if (loading) return <ActivityIndicator color={theme.accent} style={{ marginTop: 40, flex: 1, backgroundColor: theme.bg }} />;

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => String(item.userno)}
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      ListEmptyComponent={<Text style={[styles.empty, { color: theme.subtext }]}>No users found</Text>}
      renderItem={({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.username?.[0]?.toUpperCase() ?? "?"}</Text>
          </View>
          <View style={styles.info}>
            <Text style={[styles.username, { color: theme.text }]}>{item.username}</Text>
            <Text style={[styles.email, { color: theme.subtext }]}>{item.email}</Text>
          </View>
          <View style={styles.meta}>
            {item.isadmin && (
              <View style={[styles.adminBadge, { borderColor: theme.accent }]}>
                <Text style={[styles.adminBadgeText, { color: theme.accent }]}>Admin</Text>
              </View>
            )}
            <View style={styles.watchStat}>
              <Ionicons name="eye-outline" size={13} color={theme.subtext} />
              <Text style={[styles.watchCount, { color: theme.subtext }]}>{item.totalwatched ?? 0}</Text>
            </View>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  content: { padding: 16, paddingBottom: 40 },
  empty: { color: "#555", textAlign: "center", marginTop: 40 },
  card: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#141414",
    borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#222",
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: "#00c030",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  info: { flex: 1 },
  username: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  email: { color: "#888", fontSize: 12, marginTop: 2 },
  meta: { alignItems: "flex-end", gap: 6 },
  adminBadge: {
    backgroundColor: "#1e3a2f", borderRadius: 6, paddingHorizontal: 8,
    paddingVertical: 3, borderWidth: 1, borderColor: "#00c030",
  },
  adminBadgeText: { color: "#00c030", fontSize: 11, fontWeight: "bold" },
  watchStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  watchCount: { color: "#888", fontSize: 12 },
});
