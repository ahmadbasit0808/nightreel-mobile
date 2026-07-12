import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { useTheme } from "../../lib/ThemeContext";
import { usersAPI } from "../../lib/api";
import MovieCard from "../../components/MovieCard";

const TABS = ["Watchlist", "Watched", "Reviews"];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Watchlist");

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      Promise.all([
        usersAPI.get(user.userno),
        usersAPI.getWatchlist(user.userno),
        usersAPI.getWatched(user.userno),
        usersAPI.getReviews(user.userno),
      ])
        .then(([{ data: p }, { data: wl }, { data: wa }, { data: re }]) => {
          setProfile(p);
          setWatchlist(wl);
          setWatched(wa);
          setReviews(re);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [user]),
  );

  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={styles.emptyIcon}>🎬</Text>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>You're not signed in</Text>
        <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>Sign in to track your movies</Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.accent }]}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnOutline, { borderColor: theme.accent }]}
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text style={[styles.btnOutlineText, { color: theme.accent }]}>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading)
    return <ActivityIndicator color={theme.accent} style={{ marginTop: 60, backgroundColor: theme.bg, flex: 1 }} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.username?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text style={[styles.username, { color: theme.text }]}>{profile?.username}</Text>
        {profile?.bio ? <Text style={[styles.bio, { color: theme.subtext }]}>{profile.bio}</Text> : null}
        <TouchableOpacity style={styles.signOutBtn} onPress={logout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        {[
          { label: "Watchlist", count: watchlist.length },
          { label: "Watched", count: watched.length },
          { label: "Reviews", count: reviews.length },
        ].map(({ label, count }) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.tabItem,
              activeTab === label && { borderBottomColor: theme.accent },
            ]}
            onPress={() => setActiveTab(label)}
          >
            <Text
              style={[
                styles.tabText,
                { color: theme.subtext },
                activeTab === label && { color: theme.accent },
              ]}
            >
              {label} ({count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Profile Tab */}
      {activeTab === "Watchlist" && (
        <ScrollView contentContainerStyle={styles.tabContent}>
          {watchlist.length === 0 ? (
            <Text style={[styles.empty, { color: theme.subtext }]}>No movies in your watchlist</Text>
          ) : (
            <FlatList
              data={watchlist}
              keyExtractor={(item) => String(item.movieno)}
              numColumns={3}
              scrollEnabled={false}
              renderItem={({ item }) => <MovieCard movie={item} small />}
            />
          )}
        </ScrollView>
      )}

      {/* Watched Tab */}
      {activeTab === "Watched" && (
        <FlatList
          data={watched}
          keyExtractor={(item) => String(item.movieno)}
          numColumns={3}
          contentContainerStyle={styles.tabContent}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: theme.subtext }]}>No watched movies yet</Text>
          }
          renderItem={({ item }) => <MovieCard movie={item} small />}
        />
      )}

      {/* Reviews Tab */}
      {activeTab === "Reviews" && (
        <FlatList
          data={reviews}
          keyExtractor={(item) => String(item.reviewno)}
          contentContainerStyle={styles.tabContent}
          ListEmptyComponent={<Text style={[styles.empty, { color: theme.subtext }]}>No reviews yet</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.reviewCard, { backgroundColor: theme.card2, borderColor: theme.border }]}
              onPress={() => router.push(`/movies/${item.movieno}`)}
            >
              <View style={styles.reviewCardHeader}>
                <Text style={[styles.reviewMovieTitle, { color: theme.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.reviewStars}>
                  {"★".repeat(item.rating)}
                </Text>
              </View>
              {item.content ? (
                <Text style={[styles.reviewContent, { color: theme.subtext }]} numberOfLines={3}>
                  {item.content}
                </Text>
              ) : null}
              <Text style={[styles.reviewDate, { color: theme.subtext }]}>
                {new Date(item.datereviewed).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    padding: 24,
    gap: 12,
  },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  emptySubtitle: { color: "#888", marginBottom: 8 },

  btn: {
    backgroundColor: "#00c030",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#00c030",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  btnOutlineText: { color: "#00c030", fontWeight: "bold", fontSize: 16 },

  header: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: "#141414",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  signOutBtn: { marginTop: 8, padding: 6 },
  signOutText: { color: "#ff4444", fontSize: 13, fontWeight: "600" },
  settingsBtn: { marginTop: 4, padding: 6 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#00c030",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { color: "#fff", fontSize: 30, fontWeight: "bold" },
  username: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  bio: { color: "#888", fontSize: 13, marginTop: 4, textAlign: "center" },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#141414",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemActive: { borderBottomColor: "#00c030" },
  tabText: { color: "#888", fontWeight: "600", fontSize: 14 },
  tabTextActive: { color: "#00c030" },

  tabContent: { padding: 12, paddingBottom: 32 },

  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 4,
  },
  empty: { color: "#555", textAlign: "center", marginTop: 40, fontSize: 15 },

  reviewCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  reviewCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  reviewMovieTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  reviewStars: { color: "#ffd700", fontSize: 13 },
  reviewContent: { color: "#aaa", fontSize: 13, lineHeight: 19 },
  reviewDate: { color: "#555", fontSize: 11, marginTop: 6 },
});
