import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { CheckAuth } from '~/components';
import { IntlProvider } from '~/features/i18n';
import { ThemeProvider } from '~/features/theme';
import { LoadingPage } from '~/pages';
import { privateRoutes, publicRoutes } from '~/router';
import { useAppIntl, useAppTheme } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

const queryClient = new QueryClient();

const privateRouter = createBrowserRouter(privateRoutes);
const publicRouter = createBrowserRouter(publicRoutes);

export const App = () => {
  const user = useUserStore((state) => state.user);

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
    <QueryClientProvider client={queryClient}>
      <CheckAuth>
        <ThemeProvider
          theme={theme}
          setTheme={setTheme}
        >
          <IntlProvider
            locale={locale}
            setLocale={setLocale}
            messages={messages}
          >
            <RouterProvider router={user?.isVerified ? privateRouter : publicRouter} />
          </IntlProvider>
        </ThemeProvider>
      </CheckAuth>
    </QueryClientProvider>
  );
};
