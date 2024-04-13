import { createContext } from 'react';

export interface OutgoingMessagesState {
  outgoingMessages: OutgoingMessage[];
  setOutgoingMessages: React.Dispatch<
    React.SetStateAction<OutgoingMessagesState['outgoingMessages']>
  >;
}

export const OutgoingMessagesContext = createContext<OutgoingMessagesState>(
  {} as OutgoingMessagesState,
);
