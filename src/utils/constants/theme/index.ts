export const THEME = {
  VIOLET_LIGHT: 'violet-light',
  VIOLET_DARK: 'violet-dark',
} as const;

export const THEMES = [THEME.VIOLET_DARK, THEME.VIOLET_LIGHT];

export const THEME_DEFAULT = THEME.VIOLET_DARK;

export const THEME_LOCAL_STORAGE_KEY = 'theme';

export const EXTENDED_THEME: Record<keyof typeof THEME, ThemeExtended> = {
  VIOLET_DARK: {
    mode: 'dark',
    name: 'Violet Dark',
    tailwind: {
      bg: 'bg-violet-400',
      text: 'text-violet-400',
      border: 'border-violet-400',
    },
    theme: THEME.VIOLET_DARK,
  },
  VIOLET_LIGHT: {
    mode: 'light',
    name: 'Violet Dark',
    tailwind: {
      bg: 'bg-violet-400',
      text: 'text-violet-400',
      border: 'border-violet-400',
    },
    theme: THEME.VIOLET_LIGHT,
  },
};

export const EXTENDED_THEMES = Object.values(EXTENDED_THEME);
