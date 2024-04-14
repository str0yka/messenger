import { useContext } from 'react';

import { ReplyContext, ReplySetterContext } from './ReplyContext';

export const useReply = () => useContext(ReplyContext);
export const useReplySetter = () => useContext(ReplySetterContext);
