import { ThemeContext } from './ThemeContext';
import type { ThemeState } from './ThemeContext';

interface ThemeProviderProps extends ThemeState {
  children?: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, setTheme, children }) => (
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
);
