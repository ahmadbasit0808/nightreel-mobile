import { useEffect, useState, useCallback } from "react";
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator, Text } from "react-native";
import { moviesAPI } from "../../lib/api";
import { useFocusEffect } from "expo-router";
import { useTheme } from "../../lib/ThemeContext";
import MovieCard from "../../components/MovieCard";

export default function MoviesScreen() {
  const { theme } = useTheme();
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMovies = useCallback(
    async (pageNum = 1, query = "", reset = false) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      try {
        const { data } = await moviesAPI.list({ page: pageNum, search: query, limit: 12 });
        setMovies((prev) => reset || pageNum === 1 ? data.movies : [...prev, ...data.movies]);
        setTotalPages(data.pagination.pages);
        setPage(pageNum);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      setSearch("");
      fetchMovies(1, "", true);
    }, [fetchMovies])
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchMovies(1, search, true), 400);
    return () => clearTimeout(timer);
  }, [search, fetchMovies]);

  const loadMore = () => {
    if (!loadingMore && page < totalPages) fetchMovies(page + 1, search);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <TextInput
        style={[styles.search, { backgroundColor: theme.card2, color: theme.text, borderColor: theme.border2 }]}
        placeholder="Search movies..."
        placeholderTextColor={theme.subtext}
        value={search}
        onChangeText={setSearch}
      />
      {loading ? (
        <ActivityIndicator color="#00c030" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.movieno)}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <MovieCard movie={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#00c030" style={{ margin: 16 }} /> : null}
          ListEmptyComponent={<Text style={[styles.empty, { color: theme.subtext }]}>No movies found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: { margin: 12, padding: 10, borderRadius: 8, borderWidth: 1 },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
  empty: { textAlign: "center", marginTop: 40 },
});
