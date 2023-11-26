import { INTL_DEFAULT_LOCALE, INTL_LOCAL_STORAGE_KEY } from '~/utils/constants';

import { isLocale } from './isLocale';

export const getLocale = () => {
  const localStorageLocale = localStorage.getItem(INTL_LOCAL_STORAGE_KEY);
  const browserLocale = navigator.language;

  if (isLocale(localStorageLocale)) return localStorageLocale;
  if (isLocale(browserLocale)) return browserLocale;
  return INTL_DEFAULT_LOCALE;
};
