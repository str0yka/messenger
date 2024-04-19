import { useEffect } from 'react';

import { useIntl } from '~/features/i18n';
import { useSearchQuery } from '~/utils/api';
import { useUserStore } from '~/utils/store';

interface UseSearchListParams {
  query: string;
}

export const useSearchList = ({ query }: UseSearchListParams) => {
  const user = useUserStore((state) => state.user);
  const intl = useIntl();

  const searchDialogsQuery = useSearchQuery({
    params: { query, type: 'dialog', limit: 5 },
    options: { queryKey: ['searchDialogsQuery'], initialData: [], enabled: false, retry: false },
  });

  const searchUsersQuery = useSearchQuery({
    params: { query, type: 'user', limit: 5 },
    options: { queryKey: ['searchUsersQuery'], initialData: [], enabled: false, retry: false },
  });

  useEffect(() => {
    searchUsersQuery.refetch();
    searchDialogsQuery.refetch();
  }, [query]);

  return {
    state: {
      user,
      isNothingFound: !searchDialogsQuery.data?.length && !searchUsersQuery.data?.length,
      dialogs: searchDialogsQuery.data,
      users: searchUsersQuery.data,
    },
    functions: {
      translate: intl.t,
    },
  };
};
