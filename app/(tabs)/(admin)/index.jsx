import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { adminAPI } from "../../../lib/api";
import { useAuth } from "../../../lib/AuthContext";

export default function AdminScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("adminAPI:", adminAPI);
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await adminAPI.getDashboard();

      console.log("Dashboard response:", res.data);

      setStats(res.data);
    } catch (err) {
      console.log("Dashboard error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: 16,
      }}
    >
      <Text style={styles.welcome}>Welcome {user?.username}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Users</Text>

        <Text style={styles.number}>
          {stats?.totalusers ?? stats?.totalUsers ?? 0}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Movies</Text>

        <Text style={styles.number}>
          {stats?.totalmovies ?? stats?.totalMovies ?? 0}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Reviews</Text>

        <Text style={styles.number}>
          {stats?.totalreviews ?? stats?.totalReviews ?? 0}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Watches</Text>

        <Text style={styles.number}>
          {stats?.totalwatches ?? stats?.totalWatches ?? 0}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.manageBtn}
        onPress={() => router.push("/(admin)/movies")}
      >
        <Text style={styles.manageBtnText}>🎬 Manage Movies</Text>
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
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },

  welcome: {
    color: "#888",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },

  label: {
    color: "#aaa",
    fontSize: 14,
  },

  number: {
    color: "#00c030",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5,
  },

  manageBtn: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#00c030",
  },

  manageBtnText: {
    color: "#00c030",
    fontWeight: "bold",
    fontSize: 16,
  },
});
