import { createContext } from 'react';

export interface IntlState {
  locale: Locale;
  setLocale: React.Dispatch<React.SetStateAction<Locale>>;
  messages: Record<string, string>;
}

export const IntlContext = createContext<IntlState>({
  locale: '' as Locale,
  setLocale: () => {},
  messages: {},
});
