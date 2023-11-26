import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { IntlProvider } from '~/features/i18n';
import { privateRoutes, publicRoutes } from '~/router';
import { getLocale, getMessages } from '~/utils/helpers';

const privateRouter = createBrowserRouter(privateRoutes);
const publicRouter = createBrowserRouter(publicRoutes);

export const App = () => {
  const [locale, setLocale] = useState(getLocale());
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const localeMessages = await getMessages(locale);
      setMessages(localeMessages);
    })();
  }, [locale]);

  const isAuth = false;

  return (
    <IntlProvider
      locale={locale}
      setLocale={setLocale}
      messages={messages}
    >
      <RouterProvider router={isAuth ? privateRouter : publicRouter} />
    </IntlProvider>
  );
};
