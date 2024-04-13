type OutgoingMessage = {
  type: OutgoingMessageType;
  createdAt: Date;
  message: {
    text: string;
    image: string | null;
    createdAt: Date;
    user: User;
    replyMessage: {
      id: number;
      read: boolean;
      messageId: number;
      userId: number;
      type: MessageType;
      updatedAt: Date;
      createdAt: Date;
      user: User;
      message: {
        id: number;
        text: string;
        image: string | null;
        userId: number;
        replyMessageId: number | null;
        updatedAt: Date;
        createdAt: Date;
        user: User;
      };
    } | null;
  };
};

type OutgoingMessageType = 'FORWARDED' | 'MESSAGE';
