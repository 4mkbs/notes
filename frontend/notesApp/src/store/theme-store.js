import { create } from "zustand";

const STORAGE_KEY = "theme-preference";
let hasSystemListener = false;

const getSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getStoredPreference = () => {
  if (typeof window === "undefined") {
    return "system";
  }

  // Backward compatibility with older key: "theme"
  const savedPreference =
    localStorage.getItem(STORAGE_KEY) || localStorage.getItem("theme");

  if (["light", "dark", "system"].includes(savedPreference)) {
    return savedPreference;
  }

  return "system";
};

const resolveTheme = (preference) =>
  preference === "system" ? getSystemTheme() : preference;

const applyThemeToDOM = (theme) => {
  if (typeof document === "undefined") {
    return;
  }

  const isDark = theme === "dark";

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";

  if (document.body) {
    document.body.classList.toggle("dark", isDark);
    document.body.setAttribute("data-theme", theme);
  }
};

const setupSystemThemeListener = (set, get) => {
  if (
    hasSystemListener ||
    typeof window === "undefined" ||
    !window.matchMedia
  ) {
    return;
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    const { preference } = get();
    if (preference !== "system") {
      return;
    }

    const systemTheme = getSystemTheme();
    applyThemeToDOM(systemTheme);
    set({ theme: systemTheme });
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleChange);
  } else {
    mediaQuery.addListener(handleChange);
  }

  hasSystemListener = true;
};

export const useThemeStore = create((set, get) => {
  const initialPreference = getStoredPreference();
  const initialTheme = resolveTheme(initialPreference);

  applyThemeToDOM(initialTheme);
  setupSystemThemeListener(set, get);

  return {
    preference: initialPreference,
    theme: initialTheme,

    setTheme: (newPreference) => {
      const preference = ["light", "dark", "system"].includes(newPreference)
        ? newPreference
        : "system";

      localStorage.setItem(STORAGE_KEY, preference);
      const resolvedTheme = resolveTheme(preference);
      applyThemeToDOM(resolvedTheme);

      set({ preference, theme: resolvedTheme });
    },

    toggleTheme: () => {
      const { theme } = get();
      const nextPreference = theme === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, nextPreference);
      applyThemeToDOM(nextPreference);
      set({ preference: nextPreference, theme: nextPreference });
    },
  };
});
