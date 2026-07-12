import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { usersAPI } from "../../lib/api";
import MovieCard from "../../components/MovieCard";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAllWatchlist, setShowAllWatchlist] = useState(false);
  const [showAllWatched, setShowAllWatched] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

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
  }, [user]);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Sign in to view your profile</Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text style={[styles.btnText, { color: "#00c030" }]}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading)
    return <ActivityIndicator color="#00c030" style={{ marginTop: 40 }} />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.username}>{profile?.username}</Text>

      {profile?.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

      <View style={styles.stats}>
        {[
          ["Films", profile?.stats?.totalwatched],
          ["Reviews", profile?.stats?.totalreviews],
          ["Watchlist", profile?.stats?.watchlistcount],
        ].map(([label, val]) => (
          <View key={label} style={styles.stat}>
            <Text style={styles.statNum}>{val ?? 0}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* WATCHLIST */}
      {watchlist.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Watchlist</Text>

          <FlatList
            data={showAllWatchlist ? watchlist : watchlist.slice(0, 6)}
            keyExtractor={(item) => item.movieno}
            numColumns={3}
            scrollEnabled={false}
            renderItem={({ item }) => <MovieCard movie={item} small />}
          />

          {watchlist.length > 6 && (
            <TouchableOpacity
              onPress={() => setShowAllWatchlist(!showAllWatchlist)}
            >
              <Text style={styles.seeMore}>
                {showAllWatchlist ? "Show Less" : "See All"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* WATCHED */}
      {watched.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Watched</Text>

          <FlatList
            data={showAllWatched ? watched : watched.slice(0, 6)}
            keyExtractor={(item) => item.movieno}
            numColumns={3}
            scrollEnabled={false}
            renderItem={({ item }) => <MovieCard movie={item} small />}
          />

          {watched.length > 6 && (
            <TouchableOpacity
              onPress={() => setShowAllWatched(!showAllWatched)}
            >
              <Text style={styles.seeMore}>
                {showAllWatched ? "Show Less" : "See All"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Reviews</Text>

          {(showAllReviews ? reviews : reviews.slice(0, 3)).map((r) => (
            <View key={r.reviewno} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{r.username}</Text>

                <Text style={styles.reviewRating}>{"★".repeat(r.rating)}</Text>
              </View>

              {r.content ? (
                <Text style={styles.reviewContent}>{r.content}</Text>
              ) : null}
            </View>
          ))}

          {reviews.length > 3 && (
            <TouchableOpacity
              onPress={() => setShowAllReviews(!showAllReviews)}
            >
              <Text style={styles.seeMore}>
                {showAllReviews ? "Show Less" : "See All Reviews"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <TouchableOpacity
        style={[styles.btn, { marginTop: 24, backgroundColor: "#333" }]}
        onPress={logout}
      >
        <Text style={[styles.btnText, { color: "#ff4444" }]}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    gap: 12,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
  },

  username: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  bio: {
    color: "#aaa",
    marginTop: 4,
    marginBottom: 12,
  },

  stats: {
    flexDirection: "row",
    gap: 40,
    marginVertical: 16,
    justifyContent: "center",
  },

  stat: {
    alignItems: "center",
  },

  statNum: {
    color: "#00c030",
    fontSize: 22,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#888",
    fontSize: 12,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    marginTop: 12,
  },

  seeMore: {
    color: "#00c030",
    textAlign: "center",
    marginVertical: 12,
    fontWeight: "bold",
  },

  btn: {
    backgroundColor: "#00c030",
    padding: 14,
    borderRadius: 8,
    alignSelf: "center",
    alignItems: "center",
    width: "90%",
  },

  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#00c030",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  reviewItem: {
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  reviewUser: {
    color: "#00c030",
    fontWeight: "bold",
  },

  reviewRating: {
    color: "#ffd700",
  },

  reviewContent: {
    color: "#ccc",
  },
});
