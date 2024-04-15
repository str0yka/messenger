import { useContext } from 'react';

import { IntlContext } from '../context';

export const useIntl = () => {
  const { locale, setLocale, messages } = useContext(IntlContext);

  const t = (path: LocaleMessageId, values?: Record<string, string | number>) => {
    let message = messages[path];
    if (!message) return path;
    if (!values) return message;

    Object.entries(values).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, String(value));
    });

    return message;
  };

  return { locale, setLocale, t };
};
