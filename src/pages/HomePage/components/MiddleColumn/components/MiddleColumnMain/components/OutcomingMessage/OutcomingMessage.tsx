import { forwardRef } from 'react';

import { IconCheck, IconDoubleCheck } from '~/components/common/icons';
import { formatTime } from '~/utils/helpers';

interface OutcomingMessageProps {
  message: Message;
}

export const OutcomingMessage = forwardRef<HTMLDivElement, OutcomingMessageProps>(
  ({ message }, ref) => {
    const messageDate = new Date(message.createdAt);
    const { hours, minutes } = formatTime(messageDate);

    return (
      <div
        ref={ref}
        className="w-fit max-w-[66%]  self-end rounded-l-2xl rounded-r-lg bg-primary-500 px-2 py-1 text-white"
      >
        {message.message}
        <div className="relative top-1 float-right ml-2 flex gap-1 break-normal pb-0.5">
          <span className="text-xs font-medium text-white/50">
            {hours}:{minutes}
          </span>

          {message.read && <IconDoubleCheck className="w-4 text-white" />}
          {!message.read && <IconCheck className="w-4 text-white" />}
        </div>
      </div>
    );
  },
);
