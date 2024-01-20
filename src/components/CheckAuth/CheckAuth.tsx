import { useQuery } from 'react-query';

import { LoadingPage } from '~/pages';
import { getRefresh } from '~/utils/api';
import type { GetRefreshFailureResponse, GetRefreshSuccessResponse } from '~/utils/api';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

interface CheckAuthProps {
  children: React.ReactNode;
}

export const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
  const setUser = useUserStore((state) => state.setUser);

  const refreshQuery = useQuery<GetRefreshSuccessResponse, GetRefreshFailureResponse>({
    queryKey: 'CheckAuthRefreshQuery',
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

  if (refreshQuery.isLoading) return <LoadingPage />;

  return children;
};
