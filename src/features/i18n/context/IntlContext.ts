import { createContext } from 'react';

export interface IntlState {
  locale: Locale;
  setLocale: (locale: Locale | ((locale: Locale) => Locale)) => void;
  messages: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const IntlContext = createContext<IntlState>({
  locale: '' as Locale,
  setLocale: () => {},
  messages: {},
});
