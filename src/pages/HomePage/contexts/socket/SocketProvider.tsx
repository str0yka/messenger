import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useShallow } from 'zustand/react/shallow';

import { useDebounce } from '~/utils/hooks';
import { useChatStore, useUserStore } from '~/utils/store';

import { SocketContext } from './SocketContext';

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { id: partnerId } = useParams();

  const user = useUserStore((state) => state.user);
  const chatStore = useChatStore(
    useShallow((state) => ({
      messages: state.messages,
      lastReadMessageId: state.lastReadMessageId,
      setDialog: state.setDialog,
      setMessages: state.setMessages,
      setLastReadMessageId: state.setLastReadMessageId,
      reset: state.reset,
    })),
  );

  const debouncedLastReadMessageId = useDebounce(chatStore.lastReadMessageId, 100);

  const socketRef = useRef<IO.Socket>(
    io(import.meta.env.VITE_SOCKET_URL as string, {
      query: user!,
    }),
  );

  const socket = socketRef.current;

  useEffect(() => {
    const onGetDialogResponse: ServerToClientEvents['SERVER:GET_DIALOG_RESPONSE'] = (data) => {
      console.log('[SERVER:GET_DIALOG_RESPONSE]: ', data);
      chatStore.setDialog(data.dialog);
      chatStore.setMessages(data.messages);
    };

    const onDialogUpdateRequired: ServerToClientEvents['dialog:updateRequired'] = () => {
      console.log('dialog:updateRequired');
      socket.emit('dialog:getOrCreate', { partnerId: Number(partnerId) });
    };

    const onDialogPut: ServerToClientEvents['dialog:put'] = (d) => {
      console.log('dialog:put', d);
      chatStore.setDialog(d);
    };

    const onMessagesPut: ServerToClientEvents['messages:put'] = (msgs) => {
      console.log('messages:put', msgs);
      chatStore.setMessages(msgs);
    };

    const onMessagesPatch: ServerToClientEvents['messages:patch'] = (msgs) => {
      console.log('messages:patch', msgs);
      if (msgs.length) {
        chatStore.setMessages((prevMessages) => {
          if (!prevMessages.length) return msgs;
          if (msgs.at(0)!.id < prevMessages.at(-1)!.id) return [...prevMessages, ...msgs];
          if (msgs.at(-1)!.id > prevMessages.at(0)!.id) return [...msgs.reverse(), ...prevMessages];
          return prevMessages;
        });
      }
    };

    const onMessageAdd: ServerToClientEvents['message:add'] = (msg) => {
      console.log('message:add', msg);
      chatStore.setMessages((prevMessages) => [msg, ...prevMessages].slice(0, 40));
    };

    const onMessageDelete: ServerToClientEvents['message:delete'] = (msg) => {
      console.log('message:delete', msg);
      chatStore.setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== msg.id),
      );
    };

    const onMessagePatch: ServerToClientEvents['message:patch'] = (msg) => {
      console.log('message:patch');
      chatStore.setMessages((prevMessages) =>
        prevMessages.map((message) => (msg.id === message.id ? { ...message, ...msg } : message)),
      );
    };

    const onMessagesRead: ServerToClientEvents['messages:read'] = (lastReadMsgId) => {
      console.log('messages:read', lastReadMsgId);
      chatStore.setMessages((prevMessages) =>
        prevMessages.map((prevMessage) =>
          !prevMessage.read && prevMessage.id <= lastReadMsgId
            ? { ...prevMessage, read: true }
            : prevMessage,
        ),
      );
    };

    socket.on('SERVER:GET_DIALOG_RESPONSE', onGetDialogResponse);
    socket.on('dialog:put', onDialogPut);
    socket.on('dialog:updateRequired', onDialogUpdateRequired);
    socket.on('message:patch', onMessagePatch);
    socket.on('message:delete', onMessageDelete);
    socket.on('message:add', onMessageAdd);
    socket.on('messages:patch', onMessagesPatch);
    socket.on('messages:put', onMessagesPut);
    socket.on('messages:read', onMessagesRead);

    return () => {
      socket.off('SERVER:GET_DIALOG_RESPONSE', onGetDialogResponse);
      socket.off('dialog:put', onDialogPut);
      socket.off('dialog:updateRequired', onDialogUpdateRequired);
      socket.off('message:patch', onMessagePatch);
      socket.off('message:delete', onMessageDelete);
      socket.off('message:add', onMessageAdd);
      socket.off('messages:patch', onMessagesPatch);
      socket.off('messages:put', onMessagesPut);
      socket.off('messages:read', onMessagesRead);
    };
  }, [partnerId]);

  useEffect(() => {
    if (partnerId) {
      socket.emit('CLIENT:GET_DIALOG', { partnerId: Number(partnerId) });
    }

    return () => {
      chatStore.reset();
    };
  }, [partnerId]);

  useEffect(() => {
    if (debouncedLastReadMessageId) {
      socket.emit('messages:read', { lastReadMessageId: debouncedLastReadMessageId });
      chatStore.setLastReadMessageId(null);
    }
  }, [debouncedLastReadMessageId]);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};
