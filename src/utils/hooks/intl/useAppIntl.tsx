import { useEffect, useState } from 'react';

import { LOCALE_LOCAL_STORAGE_KEY } from '~/utils/constants';
import { getMessages, getLocale } from '~/utils/helpers';

export const useAppIntl = () => {
  const [locale, setLocale] = useState(getLocale());
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [areMessagesLoading, setAreMessagesLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const localeMessages = await getMessages(locale);
      localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, locale);
      setMessages(localeMessages);
      setAreMessagesLoading(false);
    })();
  }, [locale]);

  return {
    state: {
      locale,
      messages,
      areMessagesLoading,
    },
    func: {
      setLocale,
      setMessages,
      setAreMessagesLoading,
    },
  };
};
