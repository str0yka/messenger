type Dialog = {
  id: number;
  title: string;
  status: 'NONE' | 'TYPING';
  isPinned: boolean;
  pinnedOrder: number | null;
  pinnedMessageId: number | null;
  userId: number;
  partnerId: number;
  chatId: number;
  updatedAt: string;
  createdAt: string;
  user: User;
  partner: User;
  lastMessage: Message | null;
  unreadedMessagesCount: number;
  pinnedMessage: Message | null;
};
