import cn from 'classnames';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { getSearch } from '~/utils/api';
import { PRIVATE_ROUTE } from '~/utils/constants';

import { ChatItem } from '../ChatItem/ChatItem';

interface LeftSearchListProps {
  query: string;
  onClose: () => void;
}

export const LeftSearchList: React.FC<LeftSearchListProps> = ({ query, onClose }) => {
  const { data: searchDialogsData, refetch: searchDialogsRefetch } = useQuery({
    queryKey: '/search?type=dialog',
    queryFn: () => getSearch({ query, type: 'dialog', limit: 5 }),
    initialData: [],
    enabled: false,
    retry: false,
  });

  const { data: searchUsersData, refetch: searchUsersRefetch } = useQuery({
    queryKey: '/search?type=user',
    queryFn: () => getSearch({ query, type: 'user', limit: 5 }),
    initialData: [],
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    searchUsersRefetch();
    searchDialogsRefetch();
  }, [query]);

  if (!searchDialogsData?.length && !searchUsersData?.length) {
    return (
      <div className="flex grow flex-col items-center justify-center text-center">
        <h2 className="text-neutral-500">No results</h2>
        <p className="mt-2 text-sm font-medium text-neutral-400">There were no results</p>
        <p className="text-sm font-medium text-neutral-400">Try a new search</p>
      </div>
    );
  }

  return (
    <ul className="flex grow flex-col overflow-auto p-2">
      {!!searchDialogsData?.length && (
        <>
          <li className="flex justify-between">
            {/* $FIXME (intl) */}
            <span className="p-2 text-sm font-medium text-neutral-400">Chats and contacts</span>
            <button
              type="button"
              className={cn('text-sm text-primary-400', 'hover:underline')}
            >
              Show more
            </button>
            {/* $FIXME (intl) */}
          </li>
          {searchDialogsData.map((dialog) => (
            <Link
              to={PRIVATE_ROUTE.USER(dialog.user.id)}
              onClick={onClose}
            >
              <ChatItem
                title={dialog.title}
                avatarFallback={dialog.title[0]}
                lastMessage={dialog.lastMessage}
              />
            </Link>
          ))}
        </>
      )}
      {!!searchUsersData?.length && (
        <>
          <li className="flex justify-between">
            {/* $FIXME (intl) */}
            <span className="p-2 text-sm font-medium text-neutral-400">Global search</span>
            <button
              type="button"
              className={cn('text-sm text-primary-400', 'hover:underline')}
            >
              Show more
            </button>
            {/* $FIXME (intl) */}
          </li>
          {searchUsersData.map((user) => (
            <Link
              to={PRIVATE_ROUTE.USER(user.id)}
              onClick={onClose}
            >
              <ChatItem
                title={user.email}
                avatarFallback={user.email[0]}
              />
            </Link>
          ))}
        </>
      )}
    </ul>
  );
};
