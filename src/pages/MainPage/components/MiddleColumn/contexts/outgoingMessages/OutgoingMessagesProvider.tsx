import { useMemo, useState } from 'react';

import { OutgoingMessagesContext } from './OutgoingMessagesContext';

interface OutgoingMessagesProviderProps {
  children?: React.ReactNode;
}

export const OutgoingMessagesProvider: React.FC<OutgoingMessagesProviderProps> = ({ children }) => {
  const [outgoingMessages, setOutgoingMessages] = useState<OutgoingMessage[]>([]);

  const value = useMemo(() => ({ outgoingMessages, setOutgoingMessages }), [outgoingMessages]);

  return (
    <OutgoingMessagesContext.Provider value={value}>{children}</OutgoingMessagesContext.Provider>
  );
};
