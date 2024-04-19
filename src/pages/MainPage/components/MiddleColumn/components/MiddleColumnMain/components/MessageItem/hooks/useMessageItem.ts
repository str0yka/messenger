import { useState } from 'react';

import { useSocketEvents } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../../../../contexts';

interface UseMessageItemParams {
  message: Message;
}

export const useMessageItem = ({ message }: UseMessageItemParams) => {
  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const [isRead, setIsRead] = useState(message.read);

  const isSentByUser = message.userId === user?.id;

  useSocketEvents(
    socket,
    {
      'SERVER:MESSAGE_READ': (data) => {
        if (data.message.id === message.id) {
          setIsRead(data.message.read);
        }
      },
    },
    [],
    'MessageItem',
  );

  const observeMessage = (entry: IntersectionObserverEntry | undefined) => {
    if (entry?.isIntersecting) {
      socket.emit('CLIENT:MESSAGE_READ', { readMessage: message });
    }
  };

  return {
    state: {
      isRead,
      isSentByUser,
    },
    functions: {
      observeMessage,
    },
  };
};
