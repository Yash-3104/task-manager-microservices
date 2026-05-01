import { Toaster } from "react-hot-toast";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const THEME_KEY = "tm_theme";

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {}
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function AppProviders({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(THEME_KEY) || "light");

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyTheme(theme);
  }, []);

  const setTheme = useCallback((next) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  const themeValue = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            color: "#fff",
            border: "1px solid rgba(148, 163, 184, 0.2)"
          }
        }}
      />
    </ThemeContext.Provider>
  );
}
