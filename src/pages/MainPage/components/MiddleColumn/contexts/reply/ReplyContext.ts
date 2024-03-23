import { createContext } from 'react';

export type ReplyState = {
  replyMessage: Message | null;
  setReplyMessage: React.Dispatch<React.SetStateAction<Message | null>>;
};

export const ReplyContext = createContext<ReplyState>({} as ReplyState);
