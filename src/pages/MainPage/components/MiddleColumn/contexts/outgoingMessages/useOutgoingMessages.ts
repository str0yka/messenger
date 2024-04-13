import { useContext } from 'react';

import { OutgoingMessagesContext } from './OutgoingMessagesContext';

export const useOutgoingMessages = () => useContext(OutgoingMessagesContext);
