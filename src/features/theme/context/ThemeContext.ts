import { createContext } from 'react';

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme | ((theme: Theme) => Theme)) => void;
}

export const ThemeContext = createContext<ThemeState>({
  theme: '' as Theme,
  setTheme: () => {},
});
