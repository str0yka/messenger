interface ServerToClientEvents {
  'dialogs:put': (
    dialogs: (Dialog & {
      user: User;
      partner: User;
      lastMessage: Message | null;
      unreadedMessagesCount: number;
    })[],
  ) => void;
  'dialog:put': (
    dialog: Dialog & { user: User; partner: User; unreadedMessagesCount: number },
  ) => void;
  'dialog:patch': (
    dialog: Partial<Dialog & { user: User; partner: User; unreadedMessagesCount: number }>,
  ) => void;
  'dialogs:updateRequired': () => void;
  'dialog:updateRequired': () => void;
  'messages:patch': (messages: Message[]) => void;
  'message:patch': (message: Pick<Message, 'id'> & Partial<Message>) => void;
  'message:add': (message: Message) => void;
  'message:delete': (message: Message) => void;
}

interface ClientToServerEvents {
  'dialog:getOrCreate': (partnerId: number) => void;
  'dialogs:get': () => void;
  'messages:get': (
    dialogId: number,
    sort?: {
      orderBy?: {
        createdAt?: 'desc' | 'asc';
      };
      take?: number;
      where?: {
        id?: {
          lt?: Message['id'];
          lte?: Message['id'];
          gt?: Message['id'];
          gte?: Message['id'];
        };
        createdAt?: {
          lt?: Message['createdAt'];
          lte?: Message['createdAt'];
          gt?: Message['createdAt'];
          gte?: Message['createdAt'];
        };
      };
    },
  ) => void;
  'message:read': (messageId: number) => void;
  'message:delete': (messageId: number, dialogId: number, deleteForEveryone?: boolean) => void;
  'message:add': (chatId: number, message: string) => void;
}

namespace IO {
  type Socket = import('socket.io-client').Socket<ServerToClientEvents, ClientToServerEvents>;
  type Server = import('socket.io-client').Server<ServerToClientEvents, ClientToServerEvents>;
}
