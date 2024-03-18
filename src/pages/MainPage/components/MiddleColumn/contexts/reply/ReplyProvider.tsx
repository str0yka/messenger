import { useMemo, useState } from 'react';

import { ReplyContext } from './ReplyContext';
import type { ReplyState } from './ReplyContext';

interface ReplyProviderProps {
  children?: React.ReactNode;
}

export const ReplyProvider: React.FC<ReplyProviderProps> = ({ children }) => {
  const [replyMessage, setReplyMessage] = useState<ReplyState['replyMessage']>(null);

  const replyState = useMemo(() => ({ replyMessage, setReplyMessage }), [replyMessage]);

  return <ReplyContext.Provider value={replyState}>{children}</ReplyContext.Provider>;
};
