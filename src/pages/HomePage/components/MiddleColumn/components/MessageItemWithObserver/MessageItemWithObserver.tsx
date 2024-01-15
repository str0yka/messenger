import { Observer } from '~/components';

import { MessageItem } from '../MessageItem/MessageItem';

type MessageItemWithObserverProps = React.ComponentProps<typeof MessageItem> &
  React.ComponentProps<typeof Observer>;

export const MessageItemWithObserver: React.FC<MessageItemWithObserverProps> = ({
  message,
  sentByUser,
  ...observerProps
}) => (
  <Observer {...observerProps}>
    <MessageItem
      message={message}
      sentByUser={sentByUser}
    />
  </Observer>
);
