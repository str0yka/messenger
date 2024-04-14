import { createContext } from 'react';

export type DialogState =
  | (Dialog & {
      user: User;
      partner: User;
    })
  | null;
export type DialogSetterState = React.Dispatch<React.SetStateAction<DialogState>>;

export const DialogContext = createContext<DialogState>(null);
export const DialogSetterContext = createContext<DialogSetterState>(() => {});
