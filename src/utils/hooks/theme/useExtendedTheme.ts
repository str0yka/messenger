import { useTheme } from '~/features/theme';
import { getExtendedTheme } from '~/utils/helpers';

export const useExtendedTheme = () => {
  const themeState = useTheme();

  const extendedTheme = getExtendedTheme(themeState.theme);

  return { extendedTheme, ...themeState };
};
