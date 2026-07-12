import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const stats = [
  { value: "10+", label: "Movies catalogued" },
  { value: "4.8/5", label: "Community favorites" },
  { value: "100%", label: "Watchlist-ready" },
];

const features = [
  {
    title: "Discover",
    description: "Browse your library and find the next film to watch.",
  },
  {
    title: "Track",
    description: "Keep your watch history and ratings in one place.",
  },
  {
    title: "Share",
    description: "Save standout picks and revisit the films that mattered.",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroTextBlock}>
          <Text style={styles.eyebrow}>Nightreel</Text>
          <Text style={styles.heroTitle}>
            Track every film.{" "}
            <Text style={styles.highlight}>Rate what mattered.</Text>
          </Text>
          <Text style={styles.heroDescription}>
            Log what you watch, build a watchlist for what is next, and keep a
            personal record of the films that shaped your week.
          </Text>

          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push("/movies")}
            >
              <Text style={styles.primaryBtnText}>Browse Movies</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push("/topmovies")}
            >
              <Text style={styles.secondaryBtnText}>See Top Rated</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroVisual}>
          <Image
            source={require("../../assets/images/hero.png")}
            style={styles.heroPoster}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statBox}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Nightreel works</Text>
        {features.map((feature) => (
          <View key={feature.title} style={styles.featureCard}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: "#161616",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#252525",
  },
  heroTextBlock: {
    marginBottom: 18,
  },
  eyebrow: {
    color: "#E8B94E",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
    marginBottom: 10,
  },
  highlight: {
    color: "#E8B94E",
  },
  heroDescription: {
    color: "#b0b0b0",
    fontSize: 15,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 18,
  },
  primaryBtn: {
    backgroundColor: "#E8B94E",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  primaryBtnText: {
    color: "#111",
    fontWeight: "700",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  secondaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  heroVisual: {
    alignItems: "center",
    marginTop: 8,
  },
  heroPoster: {
    width: "70%",
    height: 250,
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#151515",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statValue: {
    color: "#E8B94E",
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    color: "#888",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  featureCard: {
    backgroundColor: "#151515",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  featureTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureDescription: {
    color: "#a0a0a0",
    fontSize: 13,
    lineHeight: 20,
  },
});
