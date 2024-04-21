import { useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

import { useUserStore } from '~/utils/store';

import { SocketContext } from './SocketContext';
import type { SocketState } from './SocketContext';

interface SocketProviderProps {
  children?: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const user = useUserStore((state) => state.user);

  const socket = useMemo<SocketState>(
    () =>
      io(import.meta.env.VITE_SOCKET_URL as string, {
        query: user!,
      }),
    [],
  );

  useEffect(
    () => () => {
      socket.disconnect();
    },
    [],
  );

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
