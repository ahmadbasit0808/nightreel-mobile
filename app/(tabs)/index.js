import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../lib/ThemeContext";

const stats = [
  { value: "10+", label: "Movies catalogued" },
  { value: "4.8/5", label: "Community favorites" },
  { value: "100%", label: "Watchlist-ready" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <View style={[styles.heroCard, { borderColor: theme.border }]}>
        <View style={styles.heroTextBlock}>
          <Text style={styles.eyebrow}>Nightreel</Text>
          <Text style={[styles.heroTitle, { color: theme.text }]}>
            Track every film.{" "}
            <Text style={styles.highlight}>Rate what mattered.</Text>
          </Text>
          <Text style={[styles.heroDescription, { color: theme.subtext }]}>
            Log what you watch, build a watchlist for what is next, and keep a
            personal record of the films that shaped your week.
          </Text>
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/movies")}>
              <Text style={styles.primaryBtnText}>Browse Movies</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { borderColor: theme.border2 }]} onPress={() => router.push("/topmovies")}>
              <Text style={[styles.secondaryBtnText, { color: theme.text }]}>See Top Rated</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.heroVisual}>
          <Image source={require("../../assets/images/hero.png")} style={styles.heroPoster} />
        </View>
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  heroCard: { borderRadius: 20, padding: 10, borderWidth: 1 },
  heroTextBlock: { marginBottom: 18 },
  eyebrow: { color: "#E8B94E", fontSize: 13, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 },
  heroTitle: { fontSize: 30, fontWeight: "700", lineHeight: 36, marginBottom: 10 },
  highlight: { color: "#E8B94E" },
  heroDescription: { fontSize: 15, lineHeight: 22 },
  heroActions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", marginTop: 18 },
  primaryBtn: { backgroundColor: "#E8B94E", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginRight: 10, marginBottom: 10 },
  primaryBtnText: { color: "#111", fontWeight: "700" },
  secondaryBtn: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 10 },
  secondaryBtnText: { fontWeight: "700" },
  heroVisual: { alignItems: "center", marginTop: 8 },
  heroPoster: { height: 250, objectFit: "contain" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  statBox: { flex: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 8, marginHorizontal: 4, alignItems: "center" },
  statValue: { color: "#E8B94E", fontSize: 16, fontWeight: "700" },
  statLabel: { fontSize: 11, textAlign: "center", marginTop: 4 },
});
