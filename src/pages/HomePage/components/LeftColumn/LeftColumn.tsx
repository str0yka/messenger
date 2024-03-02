import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { LeftColumnLanguageTab, LeftColumnMainTab, LeftColumnSettingsTab } from './components';
import { TabProvider } from './contexts';
import type { TabState } from './contexts';

interface LeftColumnProps {
  hideWhenShrink?: boolean;
}

const variants = {
  enter: (direction: 'back' | 'forward') => ({
    x: direction === 'forward' ? '100%' : '-50%',
    zIndex: direction === 'forward' ? 10 : 5,
    opacity: direction === 'forward' ? 1 : 0.5,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'back' | 'forward') => ({
    x: direction === 'forward' ? '-50%' : '100%',
    zIndex: direction === 'forward' ? 5 : 10,
    opacity: direction === 'forward' ? 0.5 : 1,
  }),
};

export const LeftColumn: React.FC<LeftColumnProps> = ({ hideWhenShrink = false }) => {
  const [tab, setTab] = useState<TabState>('main');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const changeTab = (newTab: React.SetStateAction<TabState>) => {
    const testTab = typeof newTab === 'function' ? newTab(tab) : newTab;

    if (tab === 'main' && testTab === 'settings') setDirection('forward');
    if (tab === 'settings' && testTab === 'language') setDirection('forward');
    if (tab === 'language' && testTab === 'settings') setDirection('back');
    if (tab === 'settings' && testTab === 'main') setDirection('back');
    return setTab(testTab);
  }; // fix soon

  return (
    <TabProvider
      tab={tab}
      setTab={changeTab}
    >
      <aside
        className={cn(
          'relative flex w-screen flex-col overflow-hidden border-r border-r-neutral-700',
          'lg:min-w-[400px] lg:max-w-[400px]',
          '2xl:min-w-[450px] 2xl:max-w-[450px]',
          {
            'max-lg:hidden': hideWhenShrink,
          },
        )}
      >
        <AnimatePresence
          mode="popLayout"
          initial={false}
          custom={direction}
        >
          <motion.div
            key={tab}
            className="flex grow flex-col bg-neutral-900"
          >
            <motion.div
              className="grow bg-neutral-800"
              variants={variants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ bounce: 0, duration: 0.25 }}
            >
              {
                {
                  main: <LeftColumnMainTab />,
                  settings: <LeftColumnSettingsTab />,
                  language: <LeftColumnLanguageTab />,
                }[tab]
              }
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </aside>
    </TabProvider>
  );
};
