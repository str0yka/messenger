import { useState } from 'react';

import { TAB, TAB_ORDER } from '../constants';
import { TabState } from '../contexts';

export const useLeftColumn = () => {
  const [tab, setTab] = useState<TabState>(TAB.MAIN);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const changeTab = (value: React.SetStateAction<TabState>) => {
    const newTab = typeof value === 'function' ? value(tab) : value;
    setDirection(TAB_ORDER[newTab] - TAB_ORDER[tab] >= 0 ? 'forward' : 'back');
    setTab(newTab);
  };

  return {
    state: {
      tab,
      direction,
    },
    functions: {
      setTab: changeTab,
      setDirection,
    },
  };
};
