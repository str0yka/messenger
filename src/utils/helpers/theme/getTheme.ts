import { THEME_DEFAULT, LOCAL_STORAGE_KEY } from '~/utils/constants';

import { isTheme } from './isTheme';

export const getTheme = () => {
  const theme = localStorage.getItem(LOCAL_STORAGE_KEY.THEME);

  return isTheme(theme) ? theme : THEME_DEFAULT;
};
