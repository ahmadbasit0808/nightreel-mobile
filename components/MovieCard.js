import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MovieCard({ movie, small = false }) {
  const router = useRouter();
  const size = small ? styles.small : styles.normal;

  return (
    <TouchableOpacity
      style={[styles.card, size]}
      onPress={() => router.push(`/movies/${movie.movieno}`)}
    >
      {movie.poster_url ? (
        <Image source={{ uri: movie.poster_url }} style={[styles.poster, small ? styles.posterSmall : styles.posterNormal]} resizeMode="cover" />
      ) : (
        <View style={[styles.poster, small ? styles.posterSmall : styles.posterNormal, styles.noImage]}>
          <Text style={styles.noImageText}>🎬</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
      {movie.avgrating > 0 && (
        <Text style={styles.rating}>⭐ {Number(movie.avgrating).toFixed(1)}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { margin: 4, flex: 1 },
  normal: { maxWidth: "50%" },
  small: { maxWidth: "33.33%" },
  poster: { borderRadius: 6, backgroundColor: "#1a1a1a" },
  posterNormal: { width: "100%", aspectRatio: 2 / 3 },
  posterSmall: { width: "100%", aspectRatio: 2 / 3 },
  noImage: { justifyContent: "center", alignItems: "center" },
  noImageText: { fontSize: 32 },
  title: { color: "#fff", fontSize: 12, marginTop: 4, fontWeight: "500" },
  rating: { color: "#ffd700", fontSize: 11, marginTop: 2 },
});
