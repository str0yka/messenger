import { createContext } from 'react';

export type TabState = 'settings' | 'main' | 'language';
export type SetTabState = React.Dispatch<React.SetStateAction<TabState>>;

export const TabContext = createContext<TabState>('main');
export const SetTabContext = createContext<SetTabState>(() => {});
