import { createContext } from 'react';

import { TABS } from '../../constants';

export type TabState = (typeof TABS)[number];
export type SetTabState = React.Dispatch<React.SetStateAction<TabState>>;

export const TabContext = createContext<TabState>('main');
export const SetTabContext = createContext<SetTabState>(() => {});
