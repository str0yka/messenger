import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import { useUserStore } from '~/utils/store';

import { useSetDialog } from '../dialog';

import { SocketContext } from './SocketContext';

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { id: partnerId } = useParams();

  const user = useUserStore((state) => state.user);
  const setDialog = useSetDialog();

  const socketRef = useRef<IO.Socket>(
    io(import.meta.env.VITE_SOCKET_URL as string, {
      query: user!,
    }),
  );

  const socket = socketRef.current;

  useEffect(() => {
    const onDialogJoinResponse: ServerToClientEvents['SERVER:DIALOG_JOIN_RESPONSE'] = (data) => {
      console.log('[SERVER:GET_DIALOG_RESPONSE]: ', data);
      setDialog(data.dialog);
    };

    const onDialogNeedToUpdate: ServerToClientEvents['SERVER:DIALOG_NEED_TO_UPDATE'] = () => {
      console.log('[SERVER:DIALOG_NEED_TO_UPDATE]: ');
      socket.emit('CLIENT:DIALOG_GET');
    };

    const onDialogGetResponse: ServerToClientEvents['SERVER:DIALOG_GET_RESPONSE'] = ({
      dialog,
    }) => {
      console.log('[SERVER:DIALOG_PUT]: ', dialog);
      setDialog(dialog);
    };

    socket.on('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
    socket.on('SERVER:DIALOG_GET_RESPONSE', onDialogGetResponse);
    socket.on('SERVER:DIALOG_NEED_TO_UPDATE', onDialogNeedToUpdate);

    return () => {
      setDialog(null);

      socket.off('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
      socket.off('SERVER:DIALOG_GET_RESPONSE', onDialogGetResponse);
      socket.off('SERVER:DIALOG_NEED_TO_UPDATE', onDialogNeedToUpdate);
    };
  }, [partnerId]);

  useEffect(() => {
    if (partnerId) {
      socket.emit('CLIENT:DIALOG_JOIN', { partnerId: Number(partnerId) });
    }
  }, [partnerId]);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};
