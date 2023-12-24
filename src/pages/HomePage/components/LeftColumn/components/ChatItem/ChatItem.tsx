import * as Avatar from '@radix-ui/react-avatar';
import cn from 'classnames';

import { IconDoubleCheck, IconCheck } from '~/components/common/icons';
import { createDate, formatTime, isToday } from '~/utils/helpers';

interface ChatItemProps {
  avatarFallback: string;
  title: string;
  lastMessage?: Message | null;
  lastMessageSentByUser?: boolean;
  unreadedMessagesCount?: number;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  title,
  avatarFallback,
  lastMessage,
  lastMessageSentByUser,
  unreadedMessagesCount,
}) => (
  <div
    className={cn(
      'flex cursor-pointer select-none gap-2 rounded-lg p-2',
      'hover:bg-neutral-700/50',
      'active:bg-neutral-600/50',
    )}
  >
    <Avatar.Root className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary-300 to-primary-500">
      <Avatar.Fallback className="text-xl font-semibold text-white">
        {avatarFallback}
      </Avatar.Fallback>
    </Avatar.Root>
    <div className="flex min-w-[0] grow flex-col">
      <div className="flex items-center gap-2">
        <h2 className="grow truncate font-semibold text-neutral-50">{title}</h2>
        {lastMessage && (
          <>
            <p className="text-xs text-neutral-400">
              {(() => {
                const date = new Date(lastMessage.createdAt);
                const { hours, minutes } = formatTime(date);
                const { dayNumber, monthShort } = createDate();
                return isToday(date) ? `${hours}:${minutes}` : `${dayNumber} ${monthShort}`;
              })()}
            </p>
            {lastMessageSentByUser && (
              <div className="w-4 text-neutral-100">
                {lastMessage.read && <IconDoubleCheck />}
                {!lastMessage.read && <IconCheck />}
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <p className="grow truncate text-neutral-400">{lastMessage?.message}</p>
        {!!unreadedMessagesCount && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-400 text-xs font-medium text-white">
            {unreadedMessagesCount}
          </div>
        )}
      </div>
    </div>
  </div>
);
