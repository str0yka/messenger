import { LOCALES } from '~/utils/constants';

export const isLocale = (locale: unknown): locale is Locale =>
  !!LOCALES.find((LOCALE) => LOCALE === locale);
