import { useEffect, useState } from 'react';

import { LOCAL_STORAGE_KEY } from '~/utils/constants';
import { getLocale, getMessages } from '~/utils/helpers';

export const useInitIntl = () => {
  const [locale, setLocale] = useState(getLocale());
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [areMessagesLoading, setAreMessagesLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const localeMessages = await getMessages(locale);
      localStorage.setItem(LOCAL_STORAGE_KEY.LOCALE, locale);
      setMessages(localeMessages);
      setAreMessagesLoading(false);
    })();
  }, [locale]);

  return { locale, setLocale, messages, areMessagesLoading };
};
