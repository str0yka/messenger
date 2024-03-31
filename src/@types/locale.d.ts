type Locale = (typeof import('~/utils/constants').LOCALES)[number];
type LocaleMessageId = keyof typeof import('~/static/locales/en-US.json');

type Language = {
  name: string;
  englishName: string;
  locale: Locale;
};
