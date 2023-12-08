type Locale = (typeof import('~/utils/constants').LOCALES)[number];

type Language = {
  name: string;
  locale: Locale;
};
