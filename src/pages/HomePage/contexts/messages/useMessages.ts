import { useContext } from 'react';

import { MessagesContext, SetMessagesContext } from './MessagesContext';

export const useMessages = () => useContext(MessagesContext);
export const useSetMessages = () => useContext(SetMessagesContext);
