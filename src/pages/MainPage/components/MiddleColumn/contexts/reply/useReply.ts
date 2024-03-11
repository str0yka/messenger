import { useContext } from 'react';

import { ReplyContext } from './ReplyContext';

export const useReply = () => useContext(ReplyContext);
