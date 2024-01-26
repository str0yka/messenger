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
  'messages:put': (messages: Message[]) => void;
  'messages:patch': (messages: Message[]) => void;
  'message:patch': (message: Pick<Message, 'id'> & Partial<Message>) => void;
  'message:add': (message: Message) => void;
  'message:delete': (message: Message) => void;
}

interface ClientToServerEvents {
  'dialog:getOrCreate': (partnerId: number) => void;
  'dialogs:get': () => void;
  'messages:get': (params: {
    dialogId: number;
    filter?: {
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
          lt?: number;
          lte?: number;
          gt?: number;
          gte?: number;
        };
      };
    };
    method?: 'put' | 'patch';
  }) => void;
  'message:read': (messageId: number) => void;
  'message:delete': (messageId: number, dialogId: number, deleteForEveryone?: boolean) => void;
  'message:add': (chatId: number, message: { message: string; createdAt: number }) => void;
}

namespace IO {
  type Socket = import('socket.io-client').Socket<ServerToClientEvents, ClientToServerEvents>;
  type Server = import('socket.io-client').Server<ServerToClientEvents, ClientToServerEvents>;
}
