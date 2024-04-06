import { forwardRef, useState } from 'react';

import { IconButton } from '~/components/common';
import { IconChevronDown } from '~/components/common/icons';
import { useSocketEvents } from '~/utils/hooks';

import { useSocket } from '../../../../../../contexts';

interface ScrollDownButtonProps extends React.ComponentProps<typeof IconButton> {}

export const ScrollDownButton = forwardRef<HTMLDivElement, ScrollDownButtonProps>((props, ref) => {
  const socket = useSocket();

  const [unreadedMessagesCount, setUnreadedMessagesCount] = useState<null | number>(null);

  useSocketEvents(
    socket,
    {
      'SERVER:DIALOG_JOIN_RESPONSE': (data) => {
        setUnreadedMessagesCount(data.dialog.unreadedMessagesCount);
      },
      'SERVER:DIALOG_GET_RESPONSE': (data) => {
        setUnreadedMessagesCount(data.dialog.unreadedMessagesCount);
      },
      'SERVER:MESSAGE_READ_RESPONSE': (data) => {
        setUnreadedMessagesCount(data.unreadedMessagesCount);
      },
    },
    [],
    'ScrollDownButton',
  );

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
