import { forwardRef, useState } from 'react';

import { Observer } from '~/components';
import { useSocketEvents } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../../../contexts';
import { IncomingMessage } from '../IncomingMessage/IncomingMessage';
import { OutcomingMessage } from '../OutcomingMessage/OutcomingMessage';

interface MessageItemProps extends React.ComponentPropsWithoutRef<'div'> {
  message: Message;
  isPinned?: boolean;
  onClickReplyMessage: (replyMessageId: number) => void;
}

export const MessageItem = forwardRef<
  React.ElementRef<typeof OutcomingMessage | typeof IncomingMessage>,
  MessageItemProps
>(({ message, isPinned, onClickReplyMessage, ...props }, ref) => {
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

  if (isSentByUser)
    return (
      <OutcomingMessage
        ref={ref}
        createdAt={message.createdAt}
        read={isRead}
        type={message.type}
        isPinned={isPinned}
        message={message.message}
        onClickReplyMessage={onClickReplyMessage}
        {...props}
      />
    );

  if (isRead)
    return (
      <IncomingMessage
        ref={ref}
        createdAt={message.createdAt}
        read={isRead}
        type={message.type}
        isPinned={isPinned}
        message={message.message}
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
        createdAt={message.createdAt}
        read={isRead}
        type={message.type}
        isPinned={isPinned}
        message={message.message}
        onClickReplyMessage={onClickReplyMessage}
        {...props}
      />
    </Observer>
  );
});
