export const LOCALE = {
  RU: 'ru-RU',
  EN: 'en-US',
} as const;

export const LOCALES = Object.values(LOCALE);

export const LOCALE_DEFAULT = LOCALE.EN;

export const LOCALE_LOCAL_STORAGE_KEY = 'locale';

export const LANGUAGE: Record<keyof typeof LOCALE, Language> = {
  RU: {
    locale: 'ru-RU',
    name: 'Русский',
  },
  EN: {
    locale: 'en-US',
    name: 'English',
  },
} as const;

export const LANGUAGES = Object.values(LANGUAGE);

export const LANGUAGE_DEFAULT = LANGUAGE.RU;
