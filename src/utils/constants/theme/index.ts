export const THEME = {
  VIOLET_LIGHT: 'violet-light',
  VIOLET_DARK: 'violet-dark',
  SKY_LIGHT: 'sky-light',
  SKY_DARK: 'sky-dark',
} as const;

export const THEMES = Object.values(THEME);

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
    name: 'Violet Light',
    tailwind: {
      bg: 'bg-violet-400',
      text: 'text-violet-400',
      border: 'border-violet-400',
    },
    theme: THEME.VIOLET_LIGHT,
  },
  SKY_LIGHT: {
    mode: 'light',
    name: 'Sky Light',
    tailwind: {
      bg: 'bg-sky-400',
      text: 'text-sky-400',
      border: 'border-sky-400',
    },
    theme: THEME.SKY_LIGHT,
  },
  SKY_DARK: {
    mode: 'dark',
    name: 'Sky Light',
    tailwind: {
      bg: 'bg-sky-400',
      text: 'text-sky-400',
      border: 'border-sky-400',
    },
    theme: THEME.SKY_DARK,
  },
};

export const EXTENDED_THEMES = Object.values(EXTENDED_THEME);
