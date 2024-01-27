interface ServerToClientEvents {
  'dialogs:put': (
    dialogs: (Dialog & {
      user: User;
      partner: User;
      lastMessage: Message | null;
      unreadedMessagesCount: number;
    })[],
  ) => void;
  'dialogs:updateRequired': () => void;
  'dialog:put': (
    dialog: Dialog & { user: User; partner: User; unreadedMessagesCount: number },
  ) => void;
  'dialog:patch': (
    dialog: Partial<Dialog & { user: User; partner: User; unreadedMessagesCount: number }>,
  ) => void;
  'dialog:updateRequired': () => void;
  'message:patch': (message: Pick<Message, 'id'> & Partial<Message>) => void;
  'message:add': (message: Message) => void;
  'message:delete': (message: Message) => void;
  'messages:put': (messages: Message[]) => void;
  'messages:patch': (messages: Message[]) => void;
  'messages:read': (lastReadMessageId: Message['id']) => void;
}

interface ClientToServerEvents {
  'dialog:getOrCreate': (params: { partnerId: number }) => void;
  'dialogs:get': () => void;
  'messages:read': (params: { lastReadMessageId: Message['id'] }) => void;
  'message:delete': (params: { messageId: number; deleteForEveryone?: boolean }) => void;
  'message:add': (message: { message: string; createdAt: number }) => void;
  'messages:get': (params: {
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
}

namespace IO {
  type Socket = import('socket.io-client').Socket<ServerToClientEvents, ClientToServerEvents>;
  type Server = import('socket.io-client').Server<ServerToClientEvents, ClientToServerEvents>;
}
