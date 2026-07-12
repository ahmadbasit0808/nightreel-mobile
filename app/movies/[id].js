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

const STARS = [1, 2, 3, 4, 5];

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useAuth();

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

  useEffect(() => { fetchMovie(); }, [id]);

  const toggleWatched = async () => {
    if (!user) return Alert.alert("Sign in required");
    movie.watched
      ? await reviewsAPI.unmarkWatched(id)
      : await reviewsAPI.markWatched(id);
    fetchMovie();
  };

  const toggleWatchlist = async () => {
    if (!user) return Alert.alert("Sign in required");
    movie.inWatchlist
      ? await reviewsAPI.removeFromWatchlist(id)
      : await reviewsAPI.addToWatchlist(id);
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
      <View style={styles.center}>
        <ActivityIndicator color="#00c030" size="large" />
      </View>
    );

  if (!movie) return <Text style={styles.error}>Movie not found</Text>;

  return (
    <ScrollView style={styles.container}>
      {movie.poster_url ? (
        <Image source={{ uri: movie.poster_url }} style={styles.poster} resizeMode="cover" />
      ) : null}

      <View style={styles.body}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.meta}>{movie.releaseyear}</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.avgRating}>⭐ {Number(movie.avgrating).toFixed(1)}</Text>
          <Text style={styles.reviewCount}>{movie.totalreviews} reviews</Text>
        </View>

        {movie.synopsis ? <Text style={styles.synopsis}>{movie.synopsis}</Text> : null}

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, movie.watched && styles.actionBtnActive]}
            onPress={toggleWatched}
          >
            <Text style={styles.actionBtnText}>{movie.watched ? "✓ Watched" : "Mark Watched"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, movie.inWatchlist && styles.actionBtnActive]}
            onPress={toggleWatchlist}
          >
            <Text style={styles.actionBtnText}>{movie.inWatchlist ? "✓ Watchlist" : "+ Watchlist"}</Text>
          </TouchableOpacity>
        </View>

        {/* Review form */}
        {user && (
          <View style={styles.reviewForm}>
            <Text style={styles.sectionTitle}>
              {movie.myReview ? "Update Your Review" : "Write a Review"}
            </Text>
            <View style={styles.stars}>
              {STARS.map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Text style={[styles.star, s <= rating && styles.starActive]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Your thoughts... (optional)"
              placeholderTextColor="#666"
              multiline
              value={content}
              onChangeText={setContent}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={submitReview} disabled={submitting}>
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
            <Text style={styles.sectionTitle}>Reviews</Text>
            {movie.reviews.map((r) => (
              <View key={r.reviewno} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{r.username}</Text>
                  <Text style={styles.reviewRating}>{"★".repeat(r.rating)}</Text>
                </View>
                {r.content ? <Text style={styles.reviewContent}>{r.content}</Text> : null}
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
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f0f0f" },
  error: { color: "#ff4444", textAlign: "center", marginTop: 40 },
  poster: { width: "100%", height: 300 },
  body: { padding: 16 },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  meta: { color: "#888", marginTop: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 8 },
  avgRating: { color: "#ffd700", fontSize: 18, fontWeight: "bold" },
  reviewCount: { color: "#888" },
  synopsis: { color: "#ccc", lineHeight: 22, marginVertical: 12 },
  actions: { flexDirection: "row", gap: 12, marginVertical: 12 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#444", alignItems: "center" },
  actionBtnActive: { borderColor: "#00c030", backgroundColor: "#00c03020" },
  actionBtnText: { color: "#fff" },
  reviewForm: { marginTop: 16, padding: 16, backgroundColor: "#1a1a1a", borderRadius: 12 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 12, marginTop: 8 },
  stars: { flexDirection: "row", gap: 8, marginBottom: 12 },
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
  submitBtn: { backgroundColor: "#00c030", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 12 },
  submitBtnText: { color: "#fff", fontWeight: "bold" },
  reviewItem: { backgroundColor: "#1a1a1a", padding: 12, borderRadius: 8, marginBottom: 8 },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  reviewUser: { color: "#00c030", fontWeight: "bold" },
  reviewRating: { color: "#ffd700" },
  reviewContent: { color: "#ccc" },
});
