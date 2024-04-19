import { useState } from 'react';

import { useSocketEvents } from '~/utils/hooks';

import { useSocket } from '../../../../../../../contexts';

export const useScrollDownButton = () => {
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

  return {
    state: {
      unreadedMessagesCount,
    },
  };
};
