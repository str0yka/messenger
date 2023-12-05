import { THEMES } from '~/utils/constants';

export const isTheme = (theme: unknown): theme is Theme =>
  !!THEMES.find((THEME) => THEME === theme);
