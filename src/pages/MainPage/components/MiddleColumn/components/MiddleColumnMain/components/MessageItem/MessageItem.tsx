import { forwardRef, useEffect, useState } from 'react';

import { Observer } from '~/components';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../../../contexts';
import { IncomingMessage } from '../IncomingMessage/IncomingMessage';
import { OutcomingMessage } from '../OutcomingMessage/OutcomingMessage';

interface MessageItemProps extends React.ComponentPropsWithoutRef<'div'> {
  message: Message;
  isPinned?: boolean;
  onClickReplyMessage: (replyMessage: Message['message']['replyMessage']) => void;
}

export const MessageItem = forwardRef<
  React.ElementRef<typeof OutcomingMessage | typeof IncomingMessage>,
  MessageItemProps
>(({ message, isPinned, onClickReplyMessage, ...props }, ref) => {
  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const [isRead, setIsRead] = useState(message.read);

  const isSentByUser = message.userId === user?.id;

  useEffect(() => {
    const onMessagesRead: ServerToClientEvents['SERVER:MESSAGE_READ'] = (data) => {
      console.log('[MessageItem:SERVER:MESSAGE_READ]', data);
      if (data.message.id === message.id) {
        setIsRead(data.message.read);
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
        isPinned={isPinned}
        onClickReplyMessage={onClickReplyMessage}
        {...props}
      />
    );

  if (isRead)
    return (
      <IncomingMessage
        ref={ref}
        message={{ ...message, read: isRead }}
        isPinned={isPinned}
        onClickReplyMessage={onClickReplyMessage}
        {...props}
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
        isPinned={isPinned}
        onClickReplyMessage={onClickReplyMessage}
        {...props}
      />
    </Observer>
  );
});
