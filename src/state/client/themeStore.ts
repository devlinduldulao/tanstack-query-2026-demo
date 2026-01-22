import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'dim';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * Theme Store
 * 
 * A Zustand store with Immer middleware for immutable state updates
 * and persist middleware for localStorage persistence.
 * 
 * Best Practices Applied:
 * 1. Type-safe state and actions
 * 2. Immer middleware for clean, immutable updates
 * 3. Persist middleware for theme preference persistence
 * 4. Separated concerns (state vs. side effects)
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set) => ({
      theme: 'light',
      
      // Immer allows us to write "mutating" logic that becomes immutable
      setTheme: (theme) =>
        set((state) => {
          state.theme = theme;
        }),
      
      // Cycle through themes: light -> dark -> dim -> light
      toggleTheme: () =>
        set((state) => {
          const themeOrder: Theme[] = ['light', 'dark', 'dim'];
          const currentIndex = themeOrder.indexOf(state.theme);
          const nextIndex = (currentIndex + 1) % themeOrder.length;
          state.theme = themeOrder[nextIndex];
        }),
    })),
    {
      name: 'theme-storage', // localStorage key
      // Only persist the theme value, not the functions
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

/**
 * Hook to apply theme to document root
 * Call this in a useEffect at the app's root level
 */
export function useApplyTheme() {
  const theme = useThemeStore((state) => state.theme);
  
  // Apply theme class to document root
  if (typeof document !== 'undefined') {
    // Remove all theme classes first
    document.documentElement.classList.remove('light', 'dark', 'dim');
    // Add current theme class
    document.documentElement.classList.add(theme);
    // Also set data attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  return theme;
}
