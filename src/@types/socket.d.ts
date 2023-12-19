interface ServerToClientEvents {
  'dialogs:put': (
    dialogs: (Dialog & { user: User; partner: User; lastMessage: Message | null })[],
  ) => void;
  'dialog:put': (
    dialog: (Dialog & { user: User; partner: User; messages: Message[] }) | null,
  ) => void;
  'dialogs:updateRequired': () => void;
  'messages:add': (message: Message) => void;
}

interface ClientToServerEvents {
  'dialog:join': (dialogId: number) => void;
  'dialog:leave': (dialogId: number) => void;
  'dialogs:create': (partnerId: number, partnerEmail: string) => void;
  'dialogs:get': () => void;
  'messages:add': (chatId: number, message: string) => void;
}

namespace IO {
  type Socket = import('socket.io-client').Socket<ServerToClientEvents, ClientToServerEvents>;
  type Server = import('socket.io-client').Server<ServerToClientEvents, ClientToServerEvents>;
}
