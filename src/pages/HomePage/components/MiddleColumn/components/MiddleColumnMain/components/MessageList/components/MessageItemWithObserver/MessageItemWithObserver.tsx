import { forwardRef } from 'react';

import { Observer } from '~/components';

import { MessageItem } from '../MessageItem/MessageItem';

type MessageItemWithObserverProps = React.ComponentProps<typeof MessageItem> &
  React.ComponentProps<typeof Observer>;

export const MessageItemWithObserver = forwardRef<HTMLDivElement, MessageItemWithObserverProps>(
  ({ message, sentByUser, ...observerProps }, ref) => (
    <Observer {...observerProps}>
      <MessageItem
        ref={ref}
        message={message}
        sentByUser={sentByUser}
      />
    </Observer>
  ),
);
