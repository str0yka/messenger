import { EXTENDED_THEMES } from '~/utils/constants';

export const getExtendedTheme = (theme: Theme) =>
  EXTENDED_THEMES.find((extendedTheme) => extendedTheme.theme === theme)!;
