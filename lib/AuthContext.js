import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from storage on app launch
    AsyncStorage.getItem("user")
      .then((stored) => {
        if (stored) setUser(JSON.parse(stored));
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    setUser(data.user);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  };

  const signup = async (credentials) => {
    const { data } = await authAPI.signup(credentials);
    setUser(data.user);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    await authAPI.logout().catch(() => {});
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
