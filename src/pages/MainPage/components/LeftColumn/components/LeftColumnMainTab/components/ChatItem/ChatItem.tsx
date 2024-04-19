import cn from 'classnames';

import { Avatar } from '~/components/common';
import { IconDoubleCheck, IconCheck, IconPushPin, IconBookmark } from '~/components/common/icons';
import { IMAGE_URL, USER_STATUS } from '~/utils/constants';

import { displayDate } from './helpers';
import { useChatItem } from './hooks';

interface ChatItemProps {
  avatar?: string | null;
  avatarFallback: string;
  title: string;
  lastMessage?: Message | null;
  lastMessageSentByUser?: boolean;
  unreadedMessagesCount?: number;
  active?: boolean;
  status?: User['status'];
  pinned?: boolean;
  savedMessages?: boolean;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  title,
  avatar,
  avatarFallback,
  lastMessage,
  lastMessageSentByUser,
  unreadedMessagesCount,
  active,
  status,
  pinned,
  savedMessages,
}) => {
  const { state, functions } = useChatItem();

  return (
    <div
      className={cn('flex cursor-pointer select-none gap-2 rounded-lg p-2', {
        'bg-primary-400': active,
        'bg-neutral-800': !active,
        'hover:bg-neutral-700': !active,
        'active:bg-neutral-600': !active,
      })}
    >
      <div className="relative">
        {savedMessages && (
          <Avatar.Root className="h-14 w-14">
            <IconBookmark className="h-7 w-7 text-white" />
          </Avatar.Root>
        )}
        {!savedMessages && (
          <>
            <Avatar.Root className="h-14 w-14">
              <Avatar.Image avatar={avatar} />
              <Avatar.Fallback>{avatarFallback}</Avatar.Fallback>
            </Avatar.Root>
            {status === USER_STATUS.ONLINE && (
              <div className="absolute bottom-[3px] right-[3px] h-3 w-3 rounded-full border-2 border-primary-900/25 bg-white" />
            )}
          </>
        )}
      </div>
      <div className="flex min-w-[0] grow flex-col">
        <div className="flex items-center gap-2">
          <h2
            className={cn('grow truncate font-semibold', {
              'text-neutral-50': !active,
              'text-white': active,
            })}
          >
            {savedMessages ? functions.translate('savedMessages') : title}
          </h2>
          {lastMessage && (
            <>
              <p
                className={cn('shrink-0 text-xs font-medium text-neutral-400', {
                  'text-white': active,
                  'text-neutral-400': !active,
                })}
              >
                {displayDate(new Date(lastMessage.createdAt), state.locale)}
              </p>
              {lastMessageSentByUser && (
                <>
                  {lastMessage.read && (
                    <IconDoubleCheck
                      className={cn('w-4', {
                        'text-neutral-50': !active,
                        'text-white': active,
                      })}
                    />
                  )}
                  {!lastMessage.read && (
                    <IconCheck
                      className={cn('w-4', {
                        'text-neutral-50': !active,
                        'text-white': active,
                      })}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastMessage?.message.image && (
            <img
              className="aspect-square w-6 rounded"
              src={IMAGE_URL(lastMessage.message.image)}
              alt=""
            />
          )}
          <p
            className={cn('grow truncate font-medium', {
              'text-neutral-400': !active,
              'text-white/90': active,
            })}
          >
            {lastMessage?.message.text}
          </p>
          {!!unreadedMessagesCount && (
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                { 'bg-primary-400 text-white': !active, 'bg-white text-primary-400': active },
              )}
            >
              {unreadedMessagesCount}
            </div>
          )}
          {!unreadedMessagesCount && pinned && (
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center text-xs',
                active && 'text-white',
                !active && 'text-neutral-400',
              )}
            >
              <IconPushPin className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
