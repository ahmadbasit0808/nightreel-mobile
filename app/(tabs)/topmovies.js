import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { moviesAPI } from "../../lib/api";
import MovieCard from "../../components/MovieCard";

export default function HomeScreen() {
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moviesAPI
      .top()
      .then(({ data }) => setTopMovies(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#00c030" size="large" />
      </View>
    );

  return (
    <FlatList
      data={topMovies}
      keyExtractor={(item) => item.movieno}
      numColumns={2}
      contentContainerStyle={styles.list}
      // ListHeaderComponent={<Text style={styles.heading}>🎬 Top Rated</Text>}
      renderItem={({ item }) => <MovieCard movie={item} />}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
  },
  list: { padding: 12, backgroundColor: "#0f0f0f" },
  heading: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
