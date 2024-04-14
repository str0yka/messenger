import type { TabState, TabSetterState } from './TabContext';
import { TabContext, TabSetterContext } from './TabContext';

interface TabProviderProps {
  tab: TabState;
  setTab: TabSetterState;
  children?: React.ReactNode;
}

export const TabProvider: React.FC<TabProviderProps> = ({ tab, setTab, children }) => (
  <TabContext.Provider value={tab}>
    <TabSetterContext.Provider value={setTab}>{children}</TabSetterContext.Provider>
  </TabContext.Provider>
);
