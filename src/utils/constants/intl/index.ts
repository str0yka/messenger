export const INTL_LOCALE = {
  RU: 'ru-RU',
  EN: 'en-US',
} as const;

export const INTL_LOCALES = [INTL_LOCALE.EN, INTL_LOCALE.RU];

export const INTL_DEFAULT_LOCALE = INTL_LOCALE.RU;

export const INTL_LOCAL_STORAGE_KEY = 'locale';
