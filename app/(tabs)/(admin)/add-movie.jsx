import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { adminAPI } from "../../../lib/api";
import { useTheme } from "../../../lib/ThemeContext";

const FIELDS = [
  { key: "title", label: "Title", placeholder: "Movie title" },
  {
    key: "releaseyear",
    label: "Release Year",
    placeholder: "e.g. 2024",
    keyboardType: "numeric",
  },
  { key: "genres", label: "Genres", placeholder: "e.g. Drama, Action" },
  { key: "director", label: "Director", placeholder: "Director name" },
  {
    key: "synopsis",
    label: "Synopsis",
    placeholder: "Short description",
    multiline: true,
  },
  { key: "poster_url", label: "Poster URL", placeholder: "https://..." },
  {
    key: "runtime_mins",
    label: "Runtime (mins)",
    placeholder: "e.g. 120",
    keyboardType: "numeric",
  },
];

export default function AddMovieScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title?.trim() || !form.releaseyear) {
      Alert.alert("Validation", "Title and release year are required.");
      return;
    }
    setLoading(true);
    try {
      await adminAPI.addMovie(form);
      Alert.alert("Success", "Movie added.", [
        {
          text: "OK",
          onPress: () =>
            router.canGoBack()
              ? router.back()
              : router.replace("/(admin)/movies"),
        },
      ]);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={{ padding: 16 }}
    >
      {FIELDS.map(({ key, label, placeholder, keyboardType, multiline }) => (
        <View key={key} style={styles.field}>
          <Text style={[styles.label, { color: theme.subtext }]}>{label}</Text>
          <TextInput
            style={[styles.input, multiline && styles.multiline, { backgroundColor: theme.card2, color: theme.text, borderColor: theme.border2 }]}
            placeholder={placeholder}
            placeholderTextColor={theme.subtext}
            keyboardType={keyboardType || "default"}
            multiline={multiline}
            value={form[key] || ""}
            onChangeText={(val) => setForm((prev) => ({ ...prev, [key]: val }))}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.accent }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Add Movie</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  field: { marginBottom: 16 },
  label: { color: "#aaa", fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    padding: 12,
    fontSize: 15,
  },
  multiline: { height: 90, textAlignVertical: "top" },
  btn: {
    backgroundColor: "#00c030",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
