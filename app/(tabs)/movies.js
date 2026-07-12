import { useEffect, useState, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { moviesAPI } from "../../lib/api";
import MovieCard from "../../components/MovieCard";

export default function MoviesScreen() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMovies = useCallback(
    async (pageNum = 1, query = search, reset = false) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const { data } = await moviesAPI.list({ page: pageNum, search: query, limit: 12 });
        setMovies((prev) => (reset || pageNum === 1 ? data.movies : [...prev, ...data.movies]));
        setTotalPages(data.pagination.pages);
        setPage(pageNum);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [search]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchMovies(1, search, true), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchMovies(1, "", true);
  }, []);

  const loadMore = () => {
    if (!loadingMore && page < totalPages) fetchMovies(page + 1);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search movies..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
      />
      {loading ? (
        <ActivityIndicator color="#00c030" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.movieno}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <MovieCard movie={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color="#00c030" style={{ margin: 16 }} /> : null
          }
          ListEmptyComponent={<Text style={styles.empty}>No movies found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  search: {
    margin: 12,
    padding: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
  empty: { color: "#888", textAlign: "center", marginTop: 40 },
});
