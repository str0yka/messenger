import cn from 'classnames';

import { Avatar } from '~/components/common';
import { IconBookmark } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { createDate, formatTime, isToday } from '~/utils/helpers';

interface SavedMessagesChatItemProps {
  lastMessage?: Message | null;
  active?: boolean;
}

export const SavedMessagesChatItem: React.FC<SavedMessagesChatItemProps> = ({
  lastMessage,
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
      <div className="relative">
        <Avatar.Root className="h-14 w-14">
          <IconBookmark className="h-7 w-7" />
        </Avatar.Root>
      </div>
      <div className="flex min-w-[0] grow flex-col">
        <div className="flex items-center gap-2">
          <h2
            className={cn('grow truncate font-semibold', {
              'text-neutral-50': !active,
              'text-white': active,
            })}
          >
            {intl.t('savedMessages')}
          </h2>
          {lastMessage && (
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
        </div>
      </div>
    </div>
  );
};
