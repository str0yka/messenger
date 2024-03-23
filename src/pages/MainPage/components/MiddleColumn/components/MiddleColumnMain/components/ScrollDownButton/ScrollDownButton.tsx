import { forwardRef, useEffect, useState } from 'react';

import { IconButton } from '~/components/common';
import { IconChevronDown } from '~/components/common/icons';

import { useSocket } from '../../../../../../contexts';

interface ScrollDownButtonProps extends React.ComponentProps<typeof IconButton> {}

export const ScrollDownButton = forwardRef<HTMLDivElement, ScrollDownButtonProps>((props, ref) => {
  const socket = useSocket();

  const [unreadedMessagesCount, setUnreadedMessagesCount] = useState<null | number>(null);

  useEffect(() => {
    const onDialogJoinResponse: ServerToClientEvents['SERVER:DIALOG_JOIN_RESPONSE'] = (data) => {
      console.log('ScrollDownButton:[SERVER:DIALOG_JOIN_RESPONSE]: ', data);
      setUnreadedMessagesCount(data.dialog.unreadedMessagesCount);
    };
    const onDialogGetResponse: ServerToClientEvents['SERVER:DIALOG_GET_RESPONSE'] = (data) => {
      console.log('ScrollDownButton:[SERVER:DIALOG_GET_RESPONSE]: ', data);
      setUnreadedMessagesCount(data.dialog.unreadedMessagesCount);
    };
    const onMessagesReadResponse: ServerToClientEvents['SERVER:MESSAGE_READ_RESPONSE'] = (data) => {
      console.log('[ScrollDownButton:SERVER:MESSAGE_READ_RESPONSE]: ', data);
      setUnreadedMessagesCount(data.unreadedMessagesCount);
    };

    socket.on('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
    socket.on('SERVER:DIALOG_GET_RESPONSE', onDialogGetResponse);
    socket.on('SERVER:MESSAGE_READ_RESPONSE', onMessagesReadResponse);

    return () => {
      socket.off('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
      socket.off('SERVER:DIALOG_GET_RESPONSE', onDialogGetResponse);
      socket.off('SERVER:MESSAGE_READ_RESPONSE', onMessagesReadResponse);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute bottom-0 right-3"
    >
      <IconButton {...props}>
        <IconChevronDown />
      </IconButton>
      {!!unreadedMessagesCount && (
        <div className="pointer-events-none absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-400 text-xs">
          {unreadedMessagesCount}
        </div>
      )}
    </div>
  );
});
