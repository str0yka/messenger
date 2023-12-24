import cn from 'classnames';

import { IconCheck, IconDoubleCheck } from '~/components/common/icons';
import { formatTime } from '~/utils/helpers';

interface MessageItemProps {
  message: Message;
  sentByUser?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, sentByUser = false }) => {
  const messageDate = new Date(message.createdAt);
  const { hours, minutes } = formatTime(messageDate);

  return (
    <div
      className={cn('w-fit max-w-[66%]  px-2 py-1', {
        'rounded-l-lg rounded-r-2xl bg-neutral-800 text-neutral-50': !sentByUser,
        'self-end rounded-l-2xl rounded-r-lg bg-primary-500 text-white': sentByUser,
      })}
    >
      {message.message}
      <div className="relative top-1 float-right ml-2 flex gap-1 break-normal pb-0.5">
        <span className="text-xs font-medium text-white/50">
          {hours}:{minutes}
        </span>
        {sentByUser && (
          <div className="w-4 text-white">
            {message.read && <IconDoubleCheck />}
            {!message.read && <IconCheck />}
          </div>
        )}
      </div>
    </div>
  );
};
