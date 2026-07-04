import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme =
  | 'light'
  | 'dark'
  | 'corporate'
  | 'bumblebee'
  | 'emerald'
  | 'garden'
  | 'lemonade'
  | 'sunset'
  | 'winter';

export const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'bumblebee', label: 'Bumblebee' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'garden', label: 'Garden' },
  { value: 'lemonade', label: 'Lemonade' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'winter', label: 'Winter' },
];

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
    }),
    {
      name: 'dnextask-theme',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
