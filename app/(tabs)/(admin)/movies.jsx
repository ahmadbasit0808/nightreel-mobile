import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { adminAPI } from "../../../lib/api";

export default function AdminMoviesScreen() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const res = await adminAPI.getMovies();
      setMovies(res.data.movies || []);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
    }, []),
  );

  const handleDelete = (movie) => {
    Alert.alert("Delete Movie", `Delete "${movie.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await adminAPI.deleteMovie(movie.movieno);
            setMovies((prev) =>
              prev.filter((m) => m.movieno !== movie.movieno),
            );
          } catch (err) {
            Alert.alert("Error", err.response?.data?.message || err.message);
          }
        },
      },
    ]);
  };

  if (loading)
    return <ActivityIndicator color="#00c030" style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/(admin)/add-movie")}
      >
        <Text style={styles.addBtnText}>+ Add Movie</Text>
      </TouchableOpacity>

      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.movieno)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.sub}>
                {item.releaseyear} · {item.genres}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                router.push({
                  pathname: "/(admin)/edit-movie",
                  params: { movie: JSON.stringify(item) },
                })
              }
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  addBtn: {
    backgroundColor: "#00c030",
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  info: { flex: 1, marginRight: 8 },
  title: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  sub: { color: "#888", fontSize: 12, marginTop: 2 },
  editBtn: {
    backgroundColor: "#1e3a2f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#00c030",
  },
  editText: { color: "#00c030", fontWeight: "bold", fontSize: 13 },
  deleteBtn: {
    backgroundColor: "#3a1e1e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  deleteText: { color: "#ff4444", fontWeight: "bold", fontSize: 13 },
});
