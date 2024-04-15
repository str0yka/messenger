import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useIntl } from '~/features/i18n';
import { useLogoutMutation } from '~/utils/api';
import { useDebounce } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

import { TAB } from '../../../constants';
import { useTabSetter } from '../../../contexts';
import { MODE, Mode, SearchFormScheme, searchFormScheme } from '../constants';

export const useLeftColumnMainTab = () => {
  const intl = useIntl();
  const resetUser = useUserStore((state) => state.resetUser);

  const setTab = useTabSetter();

  const [mode, setMode] = useState<Mode>(MODE.CHAT_LIST);

  const logoutMutation = useLogoutMutation({ onSuccess: resetUser });

  const searchForm = useForm<SearchFormScheme>({
    defaultValues: { query: '' },
    resolver: zodResolver(searchFormScheme),
  });

  const debouncedQuery = useDebounce(searchForm.watch('query'));

  const onOpenSearchList = () => setMode(MODE.SEARCH_LIST);

  const onCloseSearchList = () => {
    setMode(MODE.CHAT_LIST);
    searchForm.reset({ query: '' });
  };

  const onClickSettings = () => setTab(TAB.SETTINGS);

  const onClickLogout = () => logoutMutation.mutateAsync({});

  return {
    state: { mode, debouncedQuery },
    form: searchForm,
    functions: {
      translate: intl.t,
      onCloseSearchList,
      onOpenSearchList,
      onClickSettings,
      onClickLogout,
    },
  };
};
