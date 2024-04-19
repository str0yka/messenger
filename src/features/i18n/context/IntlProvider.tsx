import type { IntlState } from './IntlContext';
import { IntlContext } from './IntlContext';

interface IntlProviderProps extends IntlState {
  children?: React.ReactNode;
}

export const IntlProvider: React.FC<IntlProviderProps> = ({
  locale,
  setLocale,
  messages,
  children,
}: IntlProviderProps) => (
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  <IntlContext.Provider value={{ locale, setLocale, messages }}>{children}</IntlContext.Provider>
);
