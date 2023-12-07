export const INTL_LOCALE = {
  RU: 'ru-RU',
  EN: 'en-US',
} as const;

export const INTL_LOCALES = Object.values(INTL_LOCALE);

export const INTL_DEFAULT_LOCALE = INTL_LOCALE.EN;

export const INTL_LOCAL_STORAGE_KEY = 'locale';

export const INTL_LANGUAGE: Record<string, Language> = {
  RU: {
    locale: 'ru-RU',
    name: 'Русский',
  },
  EN: {
    locale: 'en-US',
    name: 'English',
  },
} as const;

export const INTL_LANGUAGES = Object.values(INTL_LANGUAGE);

export const INTL_DEFAULT_LANGUAGE = INTL_LANGUAGE.RU;
