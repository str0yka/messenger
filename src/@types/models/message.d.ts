type Message = {
  id: number;
  message: string;
  read: boolean;
  userId: number;
  replyMessageId: number | null;
  updatedAt: Date;
  createdAt: Date;
  replyMessage: Omit<Message, 'replyMessage'> | null;
  user: User;
};
