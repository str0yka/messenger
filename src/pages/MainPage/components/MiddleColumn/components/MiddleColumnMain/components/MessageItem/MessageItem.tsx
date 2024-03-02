import { forwardRef, useEffect, useState } from 'react';

import { Observer } from '~/components';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../../../contexts';
import { IncomingMessage } from '../IncomingMessage/IncomingMessage';
import { OutcomingMessage } from '../OutcomingMessage/OutcomingMessage';

interface MessageItemProps {
  message: Message;
}

export const MessageItem = forwardRef<
  React.ElementRef<typeof OutcomingMessage | typeof IncomingMessage>,
  MessageItemProps
>(({ message }, ref) => {
  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const [isRead, setIsRead] = useState(message.read);

  const isSentByUser = message.userId === user?.id;

  useEffect(() => {
    const onMessagesRead: ServerToClientEvents['SERVER:MESSAGE_READ'] = ({ readMessage }) => {
      if (readMessage.id === message.id) {
        setIsRead(readMessage.read);
      }
    };

    socket.on('SERVER:MESSAGE_READ', onMessagesRead);

    return () => {
      socket.off('SERVER:MESSAGE_READ', onMessagesRead);
    };
  }, []);

  if (isSentByUser)
    return (
      <OutcomingMessage
        ref={ref}
        message={{ ...message, read: isRead }}
      />
    );

  if (isRead)
    return (
      <IncomingMessage
        ref={ref}
        message={{ ...message, read: isRead }}
      />
    );

  return (
    <Observer
      observe={(entry) => {
        if (entry?.isIntersecting) {
          socket.emit('CLIENT:MESSAGE_READ', { readMessage: message });
        }
      }}
    >
      <IncomingMessage
        ref={ref}
        message={{ ...message, read: isRead }}
      />
    </Observer>
  );
});
