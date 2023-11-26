import { INTL_LOCALES } from '~/utils/constants';

export const isLocale = (locale: unknown): locale is Locale =>
  !!INTL_LOCALES.find((LOCALE) => LOCALE === locale);
