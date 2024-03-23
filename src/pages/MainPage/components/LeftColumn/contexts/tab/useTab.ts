import { useContext } from 'react';

import { SetTabContext, TabContext } from './TabContext';

export const useTab = () => useContext(TabContext);
export const useSetTab = () => useContext(SetTabContext);
