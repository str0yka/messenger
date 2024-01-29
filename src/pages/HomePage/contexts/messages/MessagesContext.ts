import { createContext } from 'react';

export type MessagesState = Message[];
export type SetMessagesState = React.Dispatch<React.SetStateAction<MessagesState>>;

export const MessagesContext = createContext<MessagesState>([]);
export const SetMessagesContext = createContext<SetMessagesState>(() => {});
