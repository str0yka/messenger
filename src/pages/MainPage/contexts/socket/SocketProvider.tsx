import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

import { useUserStore } from '~/utils/store';

import { SocketContext } from './SocketContext';

interface SocketProviderProps {
  children?: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const user = useUserStore((state) => state.user);

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

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};
