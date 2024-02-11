import { forwardRef, useEffect, useState } from 'react';

import { IconButton } from '~/components/common';
import { IconChevronDown } from '~/components/common/icons';

import { useSocket } from '../../../../../../contexts';

interface ScrollDownButtonProps {
  onScrollDown: () => void;
}

export const ScrollDownButton = forwardRef<HTMLDivElement, ScrollDownButtonProps>(
  ({ onScrollDown }, ref) => {
    const socket = useSocket();

    const [unreadedMessagesCount, setUnreadedMessagesCount] = useState<null | number>(null);

    useEffect(() => {
      const onGetDialogResponse: ServerToClientEvents['SERVER:GET_DIALOG_RESPONSE'] = (data) => {
        console.log('ScrollDownButton-[SERVER:GET_DIALOG_RESPONSE]: ', data);
        setUnreadedMessagesCount(data.unreadedMessagesCount);
      };
      const onMessagesReadResponse: ServerToClientEvents['SERVER:MESSAGE_READ_RESPONSE'] = (
        data,
      ) => {
        console.log('[SERVER:MESSAGE_READ_RESPONSE]: ', data.unreadedMessagesCount);
        setUnreadedMessagesCount(data.unreadedMessagesCount);
      };

      socket.on('SERVER:GET_DIALOG_RESPONSE', onGetDialogResponse);
      socket.on('SERVER:MESSAGE_READ_RESPONSE', onMessagesReadResponse);

      return () => {
        socket.off('SERVER:GET_DIALOG_RESPONSE', onGetDialogResponse);
        socket.off('SERVER:MESSAGE_READ_RESPONSE', onMessagesReadResponse);
      };
    }, []);

    return (
      <div
        ref={ref}
        className="absolute bottom-0 right-3"
      >
        <IconButton
          color="neutral"
          s="l"
          onClick={onScrollDown}
        >
          <IconChevronDown />
        </IconButton>
        {!!unreadedMessagesCount && (
          <div className="pointer-events-none absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-400 text-xs">
            {unreadedMessagesCount}
          </div>
        )}
      </div>
    );
  },
);
