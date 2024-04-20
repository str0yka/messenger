import { useContext } from 'react';

import { SocketContext } from './SocketContext';

export const useSocket = () => useContext(SocketContext);
