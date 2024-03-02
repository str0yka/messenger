import type { TabState, SetTabState } from './TabContext';
import { SetTabContext, TabContext } from './TabContext';

interface TabProviderProps {
  tab: TabState;
  setTab: SetTabState;
  children?: React.ReactNode;
}

export const TabProvider: React.FC<TabProviderProps> = ({ tab, setTab, children }) => (
  <TabContext.Provider value={tab}>
    <SetTabContext.Provider value={setTab}>{children}</SetTabContext.Provider>
  </TabContext.Provider>
);
