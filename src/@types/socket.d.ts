interface ServerToClientEvents {
  'SERVER:GET_DIALOG_RESPONSE': (response: {
    dialog: Dialog & { user: User; partner: User };
    unreadedMessagesCount: number;
    messages: Message[];
  }) => void;
  'SERVER:MESSAGE_READ_RESPONSE': (response: { unreadedMessagesCount: number }) => void;
  'SERVER:MESSAGE_READ': (response: { readMessage: Message }) => void;
  'SERVER:DIALOGS_PUT': (params: {
    dialogs: {
      dialog: Dialog & {
        user: User;
        partner: User;
      };
      lastMessage: Message | null;
      unreadedMessagesCount: number;
    }[];
  }) => void;
  'SERVER:DIALOGS_NEED_TO_UPDATE': () => void;
  'SERVER:DIALOG_PUT': (params: { dialog: Dialog & { user: User; partner: User } }) => void;
  'SERVER:DIALOG_NEED_TO_UPDATE': () => void;
  'SERVER:MESSAGE_ADD': (message: Message) => void;
  'SERVER:MESSAGE_DELETE': (message: Message) => void;
  'SERVER:MESSAGES_PUT': (messages: Message[]) => void;
  'SERVER:MESSAGES_PATCH': (messages: Message[]) => void;
}

interface ClientToServerEvents {
  'CLIENT:DIALOG_JOIN': (params: { partnerId: number }) => void;
  'CLIENT:DIALOG_GET': () => void;
  'CLIENT:DIALOGS_GET': () => void;
  'CLIENT:MESSAGE_READ': (params: { readMessage: Message }) => void;
  'CLIENT:MESSAGE_DELETE': (params: { messageId: number; deleteForEveryone?: boolean }) => void;
  'CLIENT:MESSAGE_ADD': (message: { message: string; createdAt: number }) => void;
  'CLIENT:MESSAGES_GET': (params: {
    filter?: {
      orderBy?: {
        createdAt?: 'desc' | 'asc';
      };
      take?: number;
      cursor?: {
        id: number;
      };
      skip?: number;
    };
    method?: 'PUT' | 'PATCH';
  }) => void;
}

namespace IO {
  type Socket = import('socket.io-client').Socket<ServerToClientEvents, ClientToServerEvents>;
  type Server = import('socket.io-client').Server<ServerToClientEvents, ClientToServerEvents>;
}
