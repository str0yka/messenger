import cn from 'classnames';

import { Avatar } from '~/components/common';
import { IconDoubleCheck, IconCheck } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { createDate, formatTime, isToday } from '~/utils/helpers';

interface ChatItemProps {
  avatarFallback: string;
  title: string;
  lastMessage?: Message | null;
  lastMessageSentByUser?: boolean;
  unreadedMessagesCount?: number;
  active?: boolean;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  title,
  avatarFallback,
  lastMessage,
  lastMessageSentByUser,
  unreadedMessagesCount,
  active,
}) => {
  const intl = useIntl();

  return (
    <div
      className={cn('flex cursor-pointer select-none gap-2 rounded-lg p-2', {
        'bg-primary-400': active,
        'hover:bg-neutral-700/50': !active,
        'active:bg-neutral-600/50': !active,
      })}
    >
      <Avatar
        className="h-14 w-14"
        fallback={avatarFallback}
      />
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
            {lastMessage?.message}
          </p>
          {!!unreadedMessagesCount && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-400 text-xs font-medium text-white">
              {unreadedMessagesCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
