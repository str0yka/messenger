import { useState } from 'react';

import type { MessagesState } from './MessagesContext';
import { MessagesContext, SetMessagesContext } from './MessagesContext';

interface MessagesProviderProps {
  children: React.ReactNode;
}

export const MessagesProvider: React.FC<MessagesProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessagesState>([]);

  return (
    <MessagesContext.Provider value={messages}>
      <SetMessagesContext.Provider value={setMessages}>{children}</SetMessagesContext.Provider>
    </MessagesContext.Provider>
  );
};
