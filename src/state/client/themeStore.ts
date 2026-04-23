import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type Theme = "light" | "dark" | "dim";

const themeOrder: Theme[] = ["light", "dark", "dim"];
const themeQueryKey = ["shared", "theme"] as const;
const themeStorageKey = "theme-storage";

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

function isTheme(value: string | null): value is Theme {
  return value !== null && themeOrder.includes(value as Theme);
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);

  return isTheme(storedTheme) ? storedTheme : "light";
}

function persistTheme(theme: Theme) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(themeStorageKey, theme);
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * Theme State
 *
 * Theme state lives in the TanStack Query cache so `broadcastQueryClient`
 * can synchronize it across same-origin tabs. We still mirror the current
 * value to localStorage so refreshes keep the last selected theme.
 *
 * Best Practices Applied:
 * 1. Type-safe state and actions
 * 2. Query cache as the single client-side source of truth
 * 3. localStorage persistence for page refreshes
 * 4. Separated concerns (state vs. side effects)
 * 5. No manual useCallback — React Compiler handles memoization automatically
 */
export function useThemeStore(): ThemeState {
  const queryClient = useQueryClient();
  const { data: theme = "light" } = useQuery({
    queryKey: themeQueryKey,
    queryFn: readStoredTheme,
    initialData: readStoredTheme,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const setTheme = (nextTheme: Theme) => {
    queryClient.setQueryData(themeQueryKey, nextTheme);
  };

  const toggleTheme = () => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;

    queryClient.setQueryData(themeQueryKey, themeOrder[nextIndex]);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}

/**
 * Hook to apply theme to document root
 * Call this in a useEffect at the app's root level
 */
export function useApplyTheme() {
  const { theme } = useThemeStore();

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  return theme;
}
