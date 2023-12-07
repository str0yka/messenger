type Locale = (typeof import('~/utils/constants').INTL_LOCALES)[number];

type Language = {
  name: string;
  locale: Locale;
};
