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

  useEffect(
    () => () => {
      socketRef.current.disconnect();
    },
    [],
  );

  useEffect(() => {
    if (partnerId) {
      socketRef.current.emit('CLIENT:DIALOG_JOIN', {
        partner: {
          ...(partnerId.charAt(0) === '@'
            ? { username: partnerId.slice(1) }
            : { id: Number(partnerId) }),
        },
      });
    }

    const onDialogJoinResponse: ServerToClientEvents['SERVER:DIALOG_JOIN_RESPONSE'] = (data) => {
      console.log('[SocketProvider:SERVER:GET_DIALOG_RESPONSE]: ', data);
      setDialog(data.dialog);
    };

    const onDialogGetResponse: ServerToClientEvents['SERVER:DIALOG_GET_RESPONSE'] = (data) => {
      console.log('[SocketProvider:SERVER:DIALOG_GET_RESPONSE]: ', data);
      setDialog(data.dialog);
    };

    const onDialogNeedToUpdate: ServerToClientEvents['SERVER:DIALOG_NEED_TO_UPDATE'] = () => {
      console.log('[SocketProvider:SERVER:DIALOG_NEED_TO_UPDATE]');
      socketRef.current.emit('CLIENT:DIALOG_GET');
    };

    const onDialogsNeedToUpdate: ServerToClientEvents['SERVER:DIALOGS_NEED_TO_UPDATE'] = () => {
      console.log('[SocketProvider:SERVER:DIALOGS_NEED_TO_UPDATE]');
      socketRef.current.emit('CLIENT:DIALOGS_GET');
    };

    socketRef.current.on('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
    socketRef.current.on('SERVER:DIALOG_GET_RESPONSE', onDialogGetResponse);
    socketRef.current.on('SERVER:DIALOG_NEED_TO_UPDATE', onDialogNeedToUpdate);
    socketRef.current.on('SERVER:DIALOGS_NEED_TO_UPDATE', onDialogsNeedToUpdate);

    return () => {
      setDialog(null);

      socketRef.current.off('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
      socketRef.current.off('SERVER:DIALOG_GET_RESPONSE', onDialogGetResponse);
      socketRef.current.off('SERVER:DIALOG_NEED_TO_UPDATE', onDialogNeedToUpdate);
      socketRef.current.off('SERVER:DIALOGS_NEED_TO_UPDATE', onDialogsNeedToUpdate);
    };
  }, [partnerId]);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};
