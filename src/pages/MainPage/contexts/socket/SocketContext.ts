import { createContext } from 'react';

export type SocketState = IO.Socket;

export const SocketContext = createContext<SocketState>({} as IO.Socket);
