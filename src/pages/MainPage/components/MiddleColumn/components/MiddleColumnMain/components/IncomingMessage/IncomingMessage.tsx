import cn from 'classnames';
import { forwardRef } from 'react';

import { formatTime } from '~/utils/helpers';

interface IncomingMessageProps extends React.ComponentPropsWithoutRef<'div'> {
  message: Message;
  onClickReplyMessage: (replyMessage: Message['replyMessage']) => void;
}

export const IncomingMessage = forwardRef<HTMLDivElement, IncomingMessageProps>(
  ({ message, onClickReplyMessage, ...props }, ref) => {
    const messageDate = new Date(message.createdAt);
    const { hours, minutes } = formatTime(messageDate);

    return (
      <div
        ref={ref}
        className="w-fit max-w-[66%]  rounded-l-lg rounded-r-2xl bg-neutral-800 px-2 py-1 text-neutral-50"
        {...props}
      >
        {message.replyMessage && (
          <div
            className={cn(
              'mt-1 flex h-10 grow cursor-pointer flex-col justify-center overflow-hidden rounded border-l-[3px] border-primary-400 bg-primary-400/10 px-1 text-sm',
              'hover:bg-primary-400/25',
            )}
            role="button"
            tabIndex={0}
            aria-hidden
            onClick={() => onClickReplyMessage(message.replyMessage)}
          >
            <span className="truncate font-medium leading-4 text-primary-500">
              {message.replyMessage.user.name}
            </span>
            <p className="truncate leading-5 text-neutral-300/75">{message.replyMessage.message}</p>
          </div>
        )}
        <div>
          {message.message}
          <div className="relative top-1 float-right ml-2 flex gap-1 break-normal pb-0.5">
            <span className="text-xs font-medium text-neutral-50/50">
              {hours}:{minutes}
            </span>
          </div>
        </div>
      </div>
    );
  },
);
