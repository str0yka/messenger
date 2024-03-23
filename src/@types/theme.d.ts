type Theme = (typeof import('~/utils/constants').THEMES)[number];

type ThemeMode = 'dark' | 'light';

interface ThemeExtended {
  theme: Theme;
  mode: ThemeMode;
  name: string;
  intl: string;
  tailwind: {
    text: `text-${string}-400`;
    bg: `bg-${string}-400`;
    border: `border-${string}-400`;
  };
}
