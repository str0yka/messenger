import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { SessionProvider } from '~/components';
import { IntlProvider } from '~/features/i18n';
import { ThemeProvider } from '~/features/theme';
import { LoadingPage } from '~/pages';
import { privateRoutes, publicRoutes } from '~/router';
import { ViewImageProvider } from '~/utils/contexts';
import { useInitTheme, useInitIntl } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

const queryClient = new QueryClient();

const privateRouter = createBrowserRouter(privateRoutes);
const publicRouter = createBrowserRouter(publicRoutes);

export const App = () => {
  const user = useUserStore((state) => state.user);

  const { theme, setTheme } = useInitTheme();
  const { locale, setLocale, messages, areMessagesLoading } = useInitIntl();

  if (areMessagesLoading) return <LoadingPage />;

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider
          theme={theme}
          setTheme={setTheme}
        >
          <IntlProvider
            locale={locale}
            setLocale={setLocale}
            messages={messages}
          >
            <ViewImageProvider>
              <RouterProvider router={user?.isVerified ? privateRouter : publicRouter} />
            </ViewImageProvider>
          </IntlProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
