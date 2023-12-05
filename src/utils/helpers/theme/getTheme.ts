import { THEME_DEFAULT, THEME_LOCAL_STORAGE_KEY } from '~/utils/constants';

import { isTheme } from './isTheme';

export const getTheme = () => {
  const theme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);

  return isTheme(theme) ? theme : THEME_DEFAULT;
};
