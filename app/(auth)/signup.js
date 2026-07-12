import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../lib/AuthContext";

export default function SignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!form.username || !form.email || !form.password) {
      setError("Username, email and password required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signup(form);
      router.replace("/(tabs)/profile");
    } catch (e) {
      setError(e.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const field = (key, placeholder, opts = {}) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#666"
      value={form[key]}
      onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
      {...opts}
    />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0f0f0f" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {field("username", "Username", { autoCapitalize: "none" })}
        {field("email", "Email", {
          autoCapitalize: "none",
          keyboardType: "email-address",
        })}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#666"
            value={form.password}
            secureTextEntry={!showPassword}
            onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {field("bio", "Bio (optional)", { multiline: true })}

        <TouchableOpacity
          style={styles.btn}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, justifyContent: "center", flexGrow: 1 },
  title: {
    color: "#00c030",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  error: { color: "#ff4444", textAlign: "center", marginBottom: 12 },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  btn: {
    backgroundColor: "#00c030",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#00c030", textAlign: "center", marginTop: 20 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 14,
  },

  passwordInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 14,
  },
});
