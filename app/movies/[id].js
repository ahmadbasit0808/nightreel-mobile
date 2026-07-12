import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { moviesAPI, reviewsAPI } from "../../lib/api";
import { useAuth } from "../../lib/AuthContext";
import { useTheme } from "../../lib/ThemeContext";

const STARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMovie = () =>
    moviesAPI
      .get(id)
      .then(({ data }) => {
        setMovie(data);
        navigation.setOptions({ title: data.title });
        if (data.myReview) {
          setRating(data.myReview.rating);
          setContent(data.myReview.content || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const toggleWatched = async () => {
    if (!user) return Alert.alert("Sign in required");
    if (movie.watched) {
      await reviewsAPI.unmarkWatched(id);
    } else {
      await reviewsAPI.markWatched(id);
      if (movie.inWatchlist) await reviewsAPI.removeFromWatchlist(id);
    }
    fetchMovie();
  };

  const toggleWatchlist = async () => {
    if (!user) return Alert.alert("Sign in required");
    if (movie.inWatchlist) {
      await reviewsAPI.removeFromWatchlist(id);
    } else {
      await reviewsAPI.addToWatchlist(id);
      if (movie.watched) await reviewsAPI.unmarkWatched(id);
    }
    fetchMovie();
  };

  const submitReview = async () => {
    if (!user) return Alert.alert("Sign in required");
    if (!rating) return Alert.alert("Please select a rating");
    setSubmitting(true);
    try {
      await reviewsAPI.create({ movieno: id, rating, content });
      fetchMovie();
    } catch (e) {
      Alert.alert("Error", e.response?.data?.error || "Failed to save review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={theme.accent} size="large" />
      </View>
    );

  if (!movie) return <Text style={styles.error}>Movie not found</Text>;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.info}>
            <Text style={[styles.title, { color: theme.text }]}>{movie.title}</Text>
            <Text style={[styles.meta, { color: theme.subtext }]}>{movie.releaseyear}{movie.runtime_mins ? ` · ${movie.runtime_mins} min` : null}</Text>
            {movie.director ? (
              <View style={styles.directorRow}>
                {movie.director.split(",").map((d) => (
                  <Text key={d.trim()} style={[styles.director, { color: theme.subtext }]}>{d.trim()}</Text>
                ))}
              </View>
            ) : null}
            {movie.genres ? (
              <View style={styles.genreRow}>
                {movie.genres.split(",").map((g) => (
                  <View key={g.trim()} style={[styles.genreBadge, { backgroundColor: theme.card2, borderColor: theme.border2 }]}>
                    <Text style={[styles.genreText, { color: theme.accent }]}>{g.trim()}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            <View style={styles.ratingRow}>
              <Text style={styles.avgRating}>⭐ {Number(movie.avgrating).toFixed(1)}</Text>
              <Text style={[styles.reviewCount, { color: theme.subtext }]}>{movie.totalreviews} reviews</Text>
            </View>
          </View>
          {movie.poster_url ? (
            <Image source={{ uri: movie.poster_url }} style={[styles.poster, { backgroundColor: theme.card2 }]} />
          ) : null}
        </View>

        {movie.synopsis ? (
          <Text style={[styles.synopsis, { color: theme.subtext }]}>{movie.synopsis}</Text>
        ) : null}

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: theme.border2 }, movie.watched && { borderColor: theme.accent, backgroundColor: theme.accent + "20" }]}
            onPress={toggleWatched}
          >
            <Text style={[styles.actionBtnText, { color: theme.text }]}>
              {movie.watched ? "✓ Watched" : "Mark Watched"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { borderColor: theme.border2 },
              movie.inWatchlist && { borderColor: theme.accent, backgroundColor: theme.accent + "20" },
              movie.watched && { borderColor: theme.border, opacity: 0.4 },
            ]}
            onPress={toggleWatchlist}
            disabled={movie.watched}
          >
            <Text style={[styles.actionBtnText, { color: theme.text }]}>
              {movie.inWatchlist ? "✓ Watchlist" : "+ Watchlist"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Review form */}
        {user && movie.watched && (
          <View style={[styles.reviewForm, { backgroundColor: theme.card2 }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {movie.myReview ? "Update Your Review" : "Write a Review"}
            </Text>
            <View style={styles.stars}>
              {STARS.map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Text style={[styles.star, s <= rating && styles.starActive]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.reviewInput, { backgroundColor: theme.bg, color: theme.text, borderColor: theme.border2 }]}
              placeholder="Your thoughts... (optional)"
              placeholderTextColor={theme.subtext}
              multiline
              value={content}
              onChangeText={setContent}
            />
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: theme.accent }]}
              onPress={submitReview}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Save Review</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Reviews list */}
        {movie.reviews?.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Reviews</Text>
            {movie.reviews.map((r) => (
              <View key={r.reviewno} style={[styles.reviewItem, { backgroundColor: theme.card2 }]}>
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewUser, { color: theme.accent }]}>{r.username}</Text>
                  <Text style={styles.reviewRating}>
                    {"★".repeat(r.rating)}
                  </Text>
                </View>
                {r.content ? (
                  <Text style={[styles.reviewContent, { color: theme.subtext }]}>{r.content}</Text>
                ) : null}
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
  },
  error: { color: "#ff4444", textAlign: "center", marginTop: 40 },
  body: { padding: 16 },
  topRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  info: { flex: 1 },
  poster: { width: 110, height: 165, borderRadius: 8, backgroundColor: "#1a1a1a" },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  meta: { color: "#888", marginTop: 4 },
  directorRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  director: { color: "#aaa", fontSize: 13 },
  genreRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  genreBadge: {
    backgroundColor: "#1a1a1a", borderRadius: 20, paddingHorizontal: 10,
    paddingVertical: 4, borderWidth: 1, borderColor: "#333",
  },
  genreText: { color: "#00c030", fontSize: 12 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  avgRating: { color: "#ffd700", fontSize: 18, fontWeight: "bold" },
  reviewCount: { color: "#888" },
  synopsis: { color: "#ccc", lineHeight: 22, marginVertical: 12 },
  actions: { flexDirection: "row", gap: 12, marginVertical: 12 },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    alignItems: "center",
  },
  actionBtnActive: { borderColor: "#00c030", backgroundColor: "#00c03020" },
  actionBtnDisabled: { borderColor: "#333", opacity: 0.4 },
  actionBtnText: { color: "#fff" },
  reviewForm: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  stars: { flexDirection: "row", gap: 5, marginBottom: 12 },
  star: { fontSize: 32, color: "#444" },
  starActive: { color: "#ffd700" },
  reviewInput: {
    backgroundColor: "#0f0f0f",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#00c030",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  submitBtnText: { color: "#fff", fontWeight: "bold" },
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
  reviewUser: { color: "#00c030", fontWeight: "bold" },
  reviewRating: { color: "#ffd700" },
  reviewContent: { color: "#ccc" },
});
