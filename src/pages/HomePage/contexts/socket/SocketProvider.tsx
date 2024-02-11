import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import { useUserStore } from '~/utils/store';

import { useSetDialog } from '../dialog';
import { useSetMessages } from '../messages';

import { SocketContext } from './SocketContext';

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { id: partnerId } = useParams();

  const user = useUserStore((state) => state.user);
  const setDialog = useSetDialog();

  const setMessages = useSetMessages();

  const socketRef = useRef<IO.Socket>(
    io(import.meta.env.VITE_SOCKET_URL as string, {
      query: user!,
    }),
  );

  const socket = socketRef.current;

  useEffect(() => {
    const onGetDialogResponse: ServerToClientEvents['SERVER:GET_DIALOG_RESPONSE'] = (data) => {
      console.log('[SERVER:GET_DIALOG_RESPONSE]: ', data);
      setDialog(data.dialog);
      setMessages(data.messages);
    };

    const onDialogNeedToUpdate: ServerToClientEvents['SERVER:DIALOG_NEED_TO_UPDATE'] = () => {
      console.log('[SERVER:DIALOG_NEED_TO_UPDATE]: ');
      socket.emit('CLIENT:DIALOG_GET');
    };

    const onDialogPut: ServerToClientEvents['SERVER:DIALOG_PUT'] = ({ dialog }) => {
      console.log('[SERVER:DIALOG_PUT]: ', dialog);
      setDialog(dialog);
    };

    const onMessagesPut: ServerToClientEvents['SERVER:MESSAGES_PUT'] = (msgs) => {
      console.log('[SERVER:MESSAGES_PUT]: ', msgs);
      setMessages(msgs);
    };

    const onMessagesPatch: ServerToClientEvents['SERVER:MESSAGES_PATCH'] = (msgs) => {
      console.log('[SERVER:MESSAGES_PATCH]: ', msgs);
      if (msgs.length) {
        setMessages((prevMessages) => {
          if (!prevMessages.length) return msgs;
          if (msgs.at(0)!.id < prevMessages.at(-1)!.id) return [...prevMessages, ...msgs];
          if (msgs.at(-1)!.id > prevMessages.at(0)!.id) return [...msgs.reverse(), ...prevMessages];
          return prevMessages;
        });
      }
    };

    const onMessageAdd: ServerToClientEvents['SERVER:MESSAGE_ADD'] = (msg) => {
      console.log('[SERVER:MESSAGE_ADD]: ', msg);
      setMessages((prevMessages) => [msg, ...prevMessages].slice(0, 40));
    };

    const onMessageDelete: ServerToClientEvents['SERVER:MESSAGE_DELETE'] = (msg) => {
      console.log('[SERVER:MESSAGE_DELETE]: ', msg);
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== msg.id));
    };

    socket.on('SERVER:GET_DIALOG_RESPONSE', onGetDialogResponse);
    socket.on('SERVER:DIALOG_PUT', onDialogPut);
    socket.on('SERVER:DIALOG_NEED_TO_UPDATE', onDialogNeedToUpdate);
    socket.on('SERVER:MESSAGE_DELETE', onMessageDelete);
    socket.on('SERVER:MESSAGE_ADD', onMessageAdd);
    socket.on('SERVER:MESSAGES_PATCH', onMessagesPatch);
    socket.on('SERVER:MESSAGES_PUT', onMessagesPut);

    return () => {
      socket.off('SERVER:GET_DIALOG_RESPONSE', onGetDialogResponse);
      socket.off('SERVER:DIALOG_PUT', onDialogPut);
      socket.off('SERVER:DIALOG_NEED_TO_UPDATE', onDialogNeedToUpdate);
      socket.off('SERVER:MESSAGE_DELETE', onMessageDelete);
      socket.off('SERVER:MESSAGE_ADD', onMessageAdd);
      socket.off('SERVER:MESSAGES_PATCH', onMessagesPatch);
      socket.off('SERVER:MESSAGES_PUT', onMessagesPut);
    };
  }, [partnerId]);

  useEffect(() => {
    if (partnerId) {
      socket.emit('CLIENT:DIALOG_JOIN', { partnerId: Number(partnerId) });
    }
  }, [partnerId]);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};
