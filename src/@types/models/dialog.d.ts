type Dialog = {
  id: number;
  title: string;
  status: 'NONE' | 'TYPING';
  user: User;
  partner: User;
  lastMessage: Message | null;
  unreadedMessagesCount: number;
  userId: number;
  partnerId: number;
  chatId: number;
  updatedAt: string;
  createdAt: string;
};
