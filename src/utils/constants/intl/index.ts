export const LOCALE = {
  RU: 'ru-RU',
  EN: 'en-US',
} as const;

export const LOCALES = Object.values(LOCALE);

export const LOCALE_DEFAULT = LOCALE.EN;

export const LANGUAGE: Record<keyof typeof LOCALE, Language> = {
  RU: {
    locale: 'ru-RU',
    name: 'Русский',
    englishName: 'Russian',
  },
  EN: {
    locale: 'en-US',
    name: 'English',
    englishName: 'English',
  },
} as const;

export const LANGUAGES = Object.values(LANGUAGE);

export const LANGUAGE_DEFAULT = LANGUAGE.RU;
