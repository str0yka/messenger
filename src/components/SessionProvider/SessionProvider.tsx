import { LoadingPage } from '~/pages';
import { useRefreshQuery } from '~/utils/api';
import { LOCAL_STORAGE_KEY } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const setUser = useUserStore((state) => state.setUser);

  const refreshQuery = useRefreshQuery({
    options: {
      onSuccess: (data) => {
        localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.accessToken);
        setUser(data.user);
      },
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });

  if (refreshQuery.isLoading) return <LoadingPage />;

  return children;
};
