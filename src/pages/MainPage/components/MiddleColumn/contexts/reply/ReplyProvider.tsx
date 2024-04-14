import { useState } from 'react';

import { ReplyContext, ReplySetterContext } from './ReplyContext';
import type { ReplyState } from './ReplyContext';

interface ReplyProviderProps {
  children?: React.ReactNode;
}

export const ReplyProvider: React.FC<ReplyProviderProps> = ({ children }) => {
  const [replyMessage, setReplyMessage] = useState<ReplyState>(null);

  return (
    <ReplyContext.Provider value={replyMessage}>
      <ReplySetterContext.Provider value={setReplyMessage}>{children}</ReplySetterContext.Provider>
    </ReplyContext.Provider>
  );
};
