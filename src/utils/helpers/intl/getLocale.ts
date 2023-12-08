import { LOCALE_DEFAULT, LOCALE_LOCAL_STORAGE_KEY } from '~/utils/constants';

import { isLocale } from './isLocale';

export const getLocale = () => {
  const localStorageLocale = localStorage.getItem(LOCALE_LOCAL_STORAGE_KEY);
  const browserLocale = navigator.language;

  if (isLocale(localStorageLocale)) return localStorageLocale;
  if (isLocale(browserLocale)) return browserLocale;
  return LOCALE_DEFAULT;
};
