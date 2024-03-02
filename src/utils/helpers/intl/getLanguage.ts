import { LANGUAGES } from '~/utils/constants';

export const getLanguage = (locale: Locale) =>
  LANGUAGES.find((language) => language.locale === locale)!;
