import cn from 'classnames';
import { Link } from 'react-router-dom';

import { Intl } from '~/components';
import { PRIVATE_ROUTE } from '~/utils/constants';
import { getUserLink, getUserName } from '~/utils/helpers';

import { ChatItem } from '../ChatItem/ChatItem';

import { useSearchList } from './hooks';

interface LeftSearchListProps {
  query: string;
  onClose: () => void;
}

export const SearchList: React.FC<LeftSearchListProps> = ({ query, onClose }) => {
  const { state, functions } = useSearchList({ query });

  if (state.isNothingFound) {
    return (
      <div className="flex grow flex-col items-center justify-center text-center">
        <h2 className="text-neutral-500">
          <Intl path="page.home.leftColumn.searchList.notFound" />
        </h2>
        <p className="mt-2 text-sm font-medium text-neutral-400">
          <Intl path="page.home.leftColumn.searchList.noResults" />
        </p>
        <p className="text-sm font-medium text-neutral-400">
          <Intl path="page.home.leftColumn.searchList.tryNewSearch" />
        </p>
      </div>
    );
  }

  return (
    <ul className="flex grow flex-col overflow-auto p-2">
      {!!state.dialogs?.length && (
        <>
          <li className="flex justify-between">
            <span className="p-2 text-sm font-medium text-neutral-400">
              <Intl path="page.home.leftColumn.searchList.chats" />
            </span>
            <button
              type="button"
              className={cn('text-sm text-primary-400', 'hover:underline')}
              aria-label={functions.translate('page.home.leftColumn.searchList.showMore')}
            >
              <Intl path="page.home.leftColumn.searchList.showMore" />
            </button>
          </li>
          {state.dialogs.map((dialog) => (
            <Link
              key={dialog.id}
              to={PRIVATE_ROUTE.USER(getUserLink(dialog.partner))}
              onClick={onClose}
            >
              <ChatItem
                title={getUserName(dialog.partner)}
                avatarFallback={getUserName(dialog.partner)[0]}
                lastMessage={dialog.lastMessage}
                lastMessageSentByUser={dialog.lastMessage?.userId === state.user?.id}
                unreadedMessagesCount={dialog.unreadedMessagesCount}
                avatar={dialog.partner.avatar}
                savedMessages={dialog.userId === dialog.partnerId}
              />
            </Link>
          ))}
        </>
      )}
      {!!state.users?.length && (
        <>
          <li className="flex justify-between">
            <span className="p-2 text-sm font-medium text-neutral-400">
              <Intl path="page.home.leftColumn.searchList.global" />
            </span>
            <button
              type="button"
              aria-label={functions.translate('page.home.leftColumn.searchList.showMore')}
              className={cn('text-sm text-primary-400', 'hover:underline')}
            >
              <Intl path="page.home.leftColumn.searchList.showMore" />
            </button>
          </li>
          {state.users.map((searchUser) => (
            <Link
              key={searchUser.id}
              to={PRIVATE_ROUTE.USER(getUserLink(searchUser))}
              onClick={onClose}
            >
              <ChatItem
                title={getUserName(searchUser)}
                avatar={searchUser.avatar}
                avatarFallback={getUserName(searchUser)[0]}
              />
            </Link>
          ))}
        </>
      )}
    </ul>
  );
};
