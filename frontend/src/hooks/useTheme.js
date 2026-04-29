import { useEffect, useMemo, useState } from "react";

const KEY = "tm_theme";

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(KEY) || "light");

  useEffect(() => {
    localStorage.setItem(KEY, theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyTheme(theme);
  }, []);

  const api = useMemo(
    () => ({
      theme,
      toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark"))
    }),
    [theme]
  );

  return api;
}

