import { forwardRef } from 'react';

import { Observer } from '~/components';

import { IncomingMessage } from '../IncomingMessage/IncomingMessage';
import { OutcomingMessage } from '../OutcomingMessage/OutcomingMessage';

import { useMessageItem } from './hooks';

interface MessageItemProps extends React.ComponentPropsWithoutRef<'div'> {
  message: Message;
  isPinned?: boolean;
  onClickReplyMessage: (replyMessageId: number) => void;
}

export const MessageItem = forwardRef<
  React.ElementRef<typeof OutcomingMessage | typeof IncomingMessage>,
  MessageItemProps
>(({ message, isPinned, onClickReplyMessage, ...props }, ref) => {
  const { state, functions } = useMessageItem({ message });

  if (state.isSentByUser)
    return (
      <OutcomingMessage
        ref={ref}
        createdAt={message.createdAt}
        read={state.isRead}
        type={message.type}
        isPinned={isPinned}
        message={message.message}
        onClickReplyMessage={onClickReplyMessage}
        {...props}
      />
    );

  if (state.isRead)
    return (
      <IncomingMessage
        ref={ref}
        createdAt={message.createdAt}
        read={state.isRead}
        type={message.type}
        isPinned={isPinned}
        message={message.message}
        onClickReplyMessage={onClickReplyMessage}
        {...props}
      />
    );

  return (
    <Observer observe={functions.observeMessage}>
      <IncomingMessage
        ref={ref}
        createdAt={message.createdAt}
        read={state.isRead}
        type={message.type}
        isPinned={isPinned}
        message={message.message}
        onClickReplyMessage={onClickReplyMessage}
        {...props}
      />
    </Observer>
  );
});
