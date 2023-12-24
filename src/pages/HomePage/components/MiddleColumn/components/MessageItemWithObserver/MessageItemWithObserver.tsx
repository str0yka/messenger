import { Observer } from '~/components';

import { MessageItem } from '../MessageItem/MessageItem';

type MessageItemWithObserverProps = Props<typeof MessageItem> & Props<typeof Observer>;

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
