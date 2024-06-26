interface ServerToClientEvents {
  'SERVER:DIALOG_JOIN_RESPONSE': (params: { dialog: Dialog; messages: Message[] }) => void;
  'SERVER:MESSAGE_READ_RESPONSE': (params: { unreadedMessagesCount: number }) => void;
  'SERVER:MESSAGE_READ': (params: { message: Message }) => void;
  'SERVER:DIALOGS_PUT': (params: { dialogs: { pinned: Dialog[]; unpinned: Dialog[] } }) => void;
  'SERVER:DIALOGS_NEED_TO_UPDATE': () => void;
  'SERVER:DIALOG_GET_RESPONSE': (params: { dialog: Dialog }) => void;
  'SERVER:DIALOG_NEED_TO_UPDATE': () => void;
  'SERVER:MESSAGE_ADD': (params: { message: Message }) => void;
  'SERVER:MESSAGE_DELETE': (params: { message: Message }) => void;
  'SERVER:JUMP_TO_DATE_RESPONSE': (params: {
    messages: Message[];
    firstFoundMessage?: Message;
  }) => void;
  'SERVER:JUMP_TO_MESSAGE_RESPONSE': (params: { messages: Message[]; target?: Message }) => void;
  'SERVER:MESSAGES_PUT': (params: { messages: Message[] }) => void;
  'SERVER:MESSAGES_PATCH': (params: { messages: Message[] }) => void;
  'SERVER:ERROR': (params: { event: keyof ClientToServerEvents; reason?: string }) => void;
}

interface ClientToServerEvents {
  'CLIENT:DIALOG_JOIN': (params: {
    partner: { id: number } | { username: string };
    messagesLimit?: number;
  }) => void;
  'CLIENT:DIALOG_GET': () => void;
  'CLIENT:DIALOGS_GET': () => void;
  'CLIENT:MESSAGE_READ': (params: { readMessage: Message }) => void;
  'CLIENT:MESSAGE_DELETE': (params: { messageId: number; deleteForEveryone?: boolean }) => void;
  'CLIENT:MESSAGE_ADD': (params: {
    message:
      | {
          type: 'MESSAGE';
          text: string | null;
          createdAt?: number;
          replyMessageId?: number;
          image: string | null;
        }
      | { type: 'FORWARDED'; id: number };
  }) => void;
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
  'CLIENT:JUMP_TO_DATE': (params: { timestamp: number; take?: number }) => void;
  'CLIENT:JUMP_TO_MESSAGE': (params: { messageId: number; take?: number }) => void;
  'CLIENT:DIALOG_UPDATE_STATUS': (params: { status: Dialog['status'] }) => void;
  'CLIENT:MESSAGE_PIN': (params: { messageId: number | null }) => void;
  'CLIENT:DIALOG_DELETE': (params: { dialogId: number; deleteForEveryone?: boolean }) => void;
  'CLIENT:DIALOG_LEAVE': () => void;
  'CLIENT:DIALOG_BLOCK': (params: { partnerId: number }) => void;
  'CLIENT:DIALOG_UNBLOCK': (params: { partnerId: number }) => void;
}

namespace IO {
  type Socket = import('socket.io-client').Socket<ServerToClientEvents, ClientToServerEvents>;
  type Server = import('socket.io-client').Server<ServerToClientEvents, ClientToServerEvents>;
}
