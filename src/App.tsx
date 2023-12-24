import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { IntlProvider } from '~/features/i18n';
import { ThemeProvider } from '~/features/theme';
import { LoadingPage } from '~/pages';
import { privateRoutes, publicRoutes } from '~/router';
import { GetRefreshFailureResponse, GetRefreshSuccessResponse, getRefresh } from '~/utils/api';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from '~/utils/constants';
import { useAppIntl, useAppTheme } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

// CheckAuth

interface CheckAuthProps {
  children: React.ReactNode;
}

const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
  const setUser = useUserStore((state) => state.setUser);

  const { isLoading } = useQuery<GetRefreshSuccessResponse, GetRefreshFailureResponse>({
    queryKey: '/refresh',
    queryFn: getRefresh,
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, data.accessToken);
      setUser(data.user);
    },
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingPage />;

  return children;
};

// App

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
