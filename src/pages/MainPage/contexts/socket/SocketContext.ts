import { createContext } from 'react';

export type SocketState = IO.Socket | null;

export const SocketContext = createContext<SocketState>(null);
