import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ChatStoreDialog = Dialog & {
  user: User;
  partner: User;
  unreadedMessagesCount: number;
}; // $FIXME

interface ChatStore {
  dialog: ChatStoreDialog | null;
  setDialog: (
    dialog: ChatStoreDialog | ((dialog: ChatStoreDialog | null) => ChatStoreDialog | null) | null,
  ) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
  lastReadMessageId: number | null;
  setLastReadMessageId: (
    lastReadMessageId: number | null | ((lastReadMessageId: number | null) => number | null),
  ) => void;
}

export const useChatStore = create<ChatStore>()(
  devtools((set) => ({
    dialog: null,
    setDialog: (dialog) =>
      set((state) => ({ dialog: typeof dialog === 'function' ? dialog(state.dialog) : dialog })),
    messages: [],
    setMessages: (messages) =>
      set((state) => ({
        messages: typeof messages === 'function' ? messages(state.messages) : messages,
      })),
    lastReadMessageId: null,
    setLastReadMessageId: (lastReadMessageId) =>
      set((state) => ({
        lastReadMessageId:
          typeof lastReadMessageId === 'function'
            ? lastReadMessageId(state.lastReadMessageId)
            : lastReadMessageId,
      })),
  })),
);
