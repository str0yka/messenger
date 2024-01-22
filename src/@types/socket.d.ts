interface ServerToClientEvents {
  'dialogs:put': (
    dialogs: (Dialog & {
      user: User;
      partner: User;
      lastMessage: Message | null;
      _count: { messages: number };
    })[],
  ) => void;
  'dialog:put': (dialog: Dialog & { user: User; partner: User; messages: Message[] }) => void;
  'dialogs:updateRequired': () => void;
  'message:patch': (message: Message) => void;
  'messages:add': (message: Message) => void;
  'message:delete': (message: Message) => void;
}

interface ClientToServerEvents {
  'dialog:getOrCreate': (partnerId: number) => void;
  'dialogs:get': () => void;
  'message:read': (messageId: number) => void;
  'message:delete': (messageId: number, dialogId: number, deleteForEveryone?: boolean) => void;
  'messages:add': (chatId: number, message: string) => void;
}

namespace IO {
  type Socket = import('socket.io-client').Socket<ServerToClientEvents, ClientToServerEvents>;
  type Server = import('socket.io-client').Server<ServerToClientEvents, ClientToServerEvents>;
}
