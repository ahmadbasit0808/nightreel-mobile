import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../lib/ThemeContext";

export default function SettingsScreen() {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.section, { color: theme.subtext }]}>Appearance</Text>

      <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.rowLeft}>
          <Ionicons name={mode === "dark" ? "moon" : "sunny"} size={20} color={theme.accent} />
          <Text style={[styles.rowText, { color: theme.text }]}>
            {mode === "dark" ? "Dark Mode" : "Light Mode"}
          </Text>
        </View>
        <Switch
          value={mode === "dark"}
          onValueChange={toggleTheme}
          trackColor={{ false: "#ccc", true: "#00c03060" }}
          thumbColor={theme.accent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { fontSize: 12, fontWeight: "600", letterSpacing: 1, marginBottom: 10 },
  row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 16, borderRadius: 12, borderWidth: 1,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowText: { fontSize: 15, fontWeight: "500" },
});
