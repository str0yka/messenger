import { createContext } from 'react';

export type ReplyState = Message | null;
export type ReplySetterState = React.Dispatch<React.SetStateAction<ReplyState>>;

export const ReplyContext = createContext<ReplyState>(null);
export const ReplySetterContext = createContext<ReplySetterState>(() => {});
