import { createContext } from 'react';

export interface ThemeState {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export const ThemeContext = createContext<ThemeState>({
  theme: '' as Theme,
  setTheme: () => {},
});
