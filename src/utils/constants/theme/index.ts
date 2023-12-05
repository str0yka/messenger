export const THEME = {
  VIOLET_LIGHT: 'violet-light',
  VIOLET_DARK: 'violet-dark',
} as const;

export const THEMES = [THEME.VIOLET_DARK, THEME.VIOLET_LIGHT];

export const THEME_DEFAULT = THEME.VIOLET_DARK;

export const THEME_LOCAL_STORAGE_KEY = 'theme';
