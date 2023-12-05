import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { IntlProvider } from '~/features/i18n';
import { ThemeProvider } from '~/features/theme';
import { LoadingPage } from '~/pages';
import { privateRoutes, publicRoutes } from '~/router';
import { useAppIntl, useAppTheme } from '~/utils/hooks';

const privateRouter = createBrowserRouter(privateRoutes);
const publicRouter = createBrowserRouter(publicRoutes);

export const App = () => {
  const isAuth = false;

  const {
    state: { theme },
    func: { setTheme },
  } = useAppTheme();

  const {
    state: { locale, messages, areMessagesLoading },
    func: { setLocale },
  } = useAppIntl();

  if (areMessagesLoading) return <LoadingPage />;

  return (
    <ThemeProvider
      theme={theme}
      setTheme={setTheme}
    >
      <IntlProvider
        locale={locale}
        setLocale={setLocale}
        messages={messages}
      >
        <RouterProvider router={isAuth ? privateRouter : publicRouter} />
      </IntlProvider>
    </ThemeProvider>
  );
};
