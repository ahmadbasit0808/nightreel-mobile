import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { moviesAPI } from "../../lib/api";
import { useTheme } from "../../lib/ThemeContext";
import MovieCard from "../../components/MovieCard";

export default function TopMoviesScreen() {
  const { theme } = useTheme();
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moviesAPI.top()
      .then(({ data }) => setTopMovies(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color="#00c030" size="large" />
      </View>
    );

  return (
    <FlatList
      data={topMovies}
      keyExtractor={(item) => String(item.movieno)}
      numColumns={2}
      contentContainerStyle={[styles.list, { backgroundColor: theme.bg }]}
      style={{ backgroundColor: theme.bg }}
      renderItem={({ item }) => <MovieCard movie={item} />}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 12 },
});
