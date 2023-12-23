import * as Avatar from '@radix-ui/react-avatar';
import cn from 'classnames';

import { formatTime } from '~/utils/helpers';

interface ChatItemProps {
  avatarFallback: string;
  title: string;
  lastMessage?: Message | null;
  unreadedMessagesCount?: number;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  title,
  avatarFallback,
  lastMessage,
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
        <p className="text-xs text-neutral-400">
          {lastMessage &&
            (() => {
              const date = new Date(lastMessage.createdAt);
              const { hours, minutes } = formatTime(date);
              return `${hours}:${minutes}`;
            })()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="grow truncate text-neutral-400">{lastMessage?.message}</p>
        {unreadedMessagesCount && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-400 text-xs font-medium text-white">
            {unreadedMessagesCount}
          </div>
        )}
      </div>
    </div>
  </div>
);
