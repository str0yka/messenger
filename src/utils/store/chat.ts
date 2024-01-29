import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ChatStoreDialog = Dialog & {
  user: User;
  partner: User;
}; // $FIXME

interface ChatStore {
  dialog: ChatStoreDialog | null;
  setDialog: (
    dialog: ChatStoreDialog | ((dialog: ChatStoreDialog | null) => ChatStoreDialog | null) | null,
  ) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>()(
  devtools((set) => ({
    dialog: null,
    setDialog: (dialog) =>
      set((state) => ({ dialog: typeof dialog === 'function' ? dialog(state.dialog) : dialog })),
    reset: () => set(() => ({ dialog: null, messages: [] })),
  })),
);
