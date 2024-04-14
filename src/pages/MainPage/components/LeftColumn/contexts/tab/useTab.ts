import { useContext } from 'react';

import { TabSetterContext, TabContext } from './TabContext';

export const useTab = () => useContext(TabContext);
export const useTabSetter = () => useContext(TabSetterContext);
