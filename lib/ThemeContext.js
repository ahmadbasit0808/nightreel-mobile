import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext(null);

export const THEMES = {
  dark: {
    bg: "#0f0f0f",
    card: "#141414",
    card2: "#1a1a1a",
    border: "#222",
    border2: "#333",
    text: "#fff",
    subtext: "#888",
    accent: "#00c030",
  },
  light: {
    bg: "#f2f2f2",
    card: "#fff",
    card2: "#f8f8f8",
    border: "#e0e0e0",
    border2: "#ccc",
    text: "#111",
    subtext: "#666",
    accent: "#00a028",
  },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    AsyncStorage.getItem("theme").then((t) => { if (t) setMode(t); });
  }, []);

  const toggleTheme = async () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    await AsyncStorage.setItem("theme", next);
  };

  return (
    <ThemeContext.Provider value={{ mode, theme: THEMES[mode], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
