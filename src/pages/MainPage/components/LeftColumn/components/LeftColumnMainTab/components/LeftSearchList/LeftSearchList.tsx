import cn from 'classnames';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { useIntl } from '~/features/i18n';
import { getSearch } from '~/utils/api';
import { PRIVATE_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

import { ChatItem } from '../ChatItem/ChatItem';

interface LeftSearchListProps {
  query: string;
  onClose: () => void;
}

export const LeftSearchList: React.FC<LeftSearchListProps> = ({ query, onClose }) => {
  const user = useUserStore((state) => state.user);
  const intl = useIntl();

  const searchDialogsQuery = useQuery({
    queryKey: 'LeftSearchListSearchDialogsQuery',
    queryFn: () => getSearch({ query, type: 'dialog', limit: 5 }),
    initialData: [],
    enabled: false,
    retry: false,
  });

  const searchUsersQuery = useQuery({
    queryKey: 'LeftSearchListSearchUsersQuery',
    queryFn: () => getSearch({ query, type: 'user', limit: 5 }),
    initialData: [],
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    searchUsersQuery.refetch();
    searchDialogsQuery.refetch();
  }, [query]);

  if (!searchDialogsQuery.data?.length && !searchUsersQuery.data?.length) {
    return (
      <div className="flex grow flex-col items-center justify-center text-center">
        <h2 className="text-neutral-500">{intl.t('page.home.leftColumn.searchList.notFound')}</h2>
        <p className="mt-2 text-sm font-medium text-neutral-400">
          {intl.t('page.home.leftColumn.searchList.noResults')}
        </p>
        <p className="text-sm font-medium text-neutral-400">
          {intl.t('page.home.leftColumn.searchList.tryNewSearch')}
        </p>
      </div>
    );
  }

  return (
    <ul className="flex grow flex-col overflow-auto p-2">
      {!!searchDialogsQuery.data?.length && (
        <>
          <li className="flex justify-between">
            <span className="p-2 text-sm font-medium text-neutral-400">
              {intl.t('page.home.leftColumn.searchList.chats')}
            </span>
            <button
              type="button"
              className={cn('text-sm text-primary-400', 'hover:underline')}
            >
              {intl.t('page.home.leftColumn.searchList.showMore')}
            </button>
          </li>
          {searchDialogsQuery.data.map((dialog) => (
            <Link
              key={dialog.id}
              to={PRIVATE_ROUTE.USER(dialog.partnerId)}
              onClick={onClose}
            >
              <ChatItem
                title={dialog.title}
                avatarFallback={dialog.title[0]}
                lastMessage={dialog.lastMessage}
                lastMessageSentByUser={dialog.lastMessage?.userId === user?.id}
                // eslint-disable-next-line no-underscore-dangle
                unreadedMessagesCount={dialog._count.messages}
              />
            </Link>
          ))}
        </>
      )}
      {!!searchUsersQuery.data?.length && (
        <>
          <li className="flex justify-between">
            <span className="p-2 text-sm font-medium text-neutral-400">
              {intl.t('page.home.leftColumn.searchList.chats')}
            </span>
            <button
              type="button"
              className={cn('text-sm text-primary-400', 'hover:underline')}
            >
              {intl.t('page.home.leftColumn.searchList.showMore')}
            </button>
          </li>
          {searchUsersQuery.data.map((searchUser) => (
            <Link
              key={searchUser.id}
              to={PRIVATE_ROUTE.USER(searchUser.id)}
              onClick={onClose}
            >
              <ChatItem
                title={searchUser.email}
                avatarFallback={searchUser.email[0]}
              />
            </Link>
          ))}
        </>
      )}
    </ul>
  );
};