import cn from 'classnames';

import { Avatar } from '~/components/common';
import { IconDoubleCheck, IconCheck, IconPushPin } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { USER_STATUS } from '~/utils/constants';
import { createDate, formatTime, isToday } from '~/utils/helpers';

interface ChatItemProps {
  avatarFallback: string;
  title: string;
  lastMessage?: Message | null;
  lastMessageSentByUser?: boolean;
  unreadedMessagesCount?: number;
  active?: boolean;
  status?: User['status'];
  isPinned?: boolean;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  title,
  avatarFallback,
  lastMessage,
  lastMessageSentByUser,
  unreadedMessagesCount,
  active,
  status,
  isPinned,
}) => {
  const intl = useIntl();

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
        <Avatar.Root className="h-14 w-14">
          <Avatar.Fallback>{avatarFallback}</Avatar.Fallback>
        </Avatar.Root>
        {status === USER_STATUS.ONLINE && (
          <div className="absolute bottom-[3px] right-[3px] h-3 w-3 rounded-full border-2 border-primary-900/25 bg-white" />
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
            {title}
          </h2>
          {lastMessage && (
            <>
              <p
                className={cn('shrink-0 text-xs font-medium text-neutral-400', {
                  'text-white': active,
                  'text-neutral-400': !active,
                })}
              >
                {(() => {
                  const date = new Date(lastMessage.createdAt);
                  const { hours, minutes } = formatTime(date);
                  const { dayNumber, monthShort } = createDate({ date, locale: intl.locale });
                  return isToday(date) ? `${hours}:${minutes}` : `${dayNumber} ${monthShort}`;
                })()}
              </p>
              {lastMessageSentByUser && lastMessage.read && (
                <IconDoubleCheck
                  className={cn('w-4', {
                    'text-neutral-50': !active,
                    'text-white': active,
                  })}
                />
              )}
              {lastMessageSentByUser && !lastMessage.read && (
                <IconCheck
                  className={cn('w-4', {
                    'text-neutral-50': !active,
                    'text-white': active,
                  })}
                />
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p
            className={cn('grow truncate font-medium', {
              'text-neutral-400': !active,
              'text-white/90': active,
            })}
          >
            {lastMessage?.message.text}
          </p>
          {!!unreadedMessagesCount && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-400 text-xs font-medium text-white">
              {unreadedMessagesCount}
            </div>
          )}
          {!unreadedMessagesCount && isPinned && (
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
