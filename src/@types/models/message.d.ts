type Message = {
  id: number;
  read: boolean;
  messageId: number;
  userId: number;
  type: 'FORWARDED' | 'MESSAGE';
  updatedAt: Date;
  createdAt: Date;
  user: User;
  message: {
    id: number;
    text: string;
    userId: number;
    replyMessageId: number | null;
    updatedAt: Date;
    createdAt: Date;
    user: User;
    replyMessage: {
      id: number;
      read: boolean;
      messageId: number;
      userId: number;
      type: $Enums.MessageType;
      updatedAt: Date;
      createdAt: Date;
      user: User;
      message: {
        id: number;
        text: string;
        userId: number;
        replyMessageId: number | null;
        updatedAt: Date;
        createdAt: Date;
        user: User;
      };
    } | null;
  };
};
