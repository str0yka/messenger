import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

import {
  LeftColumnLanguageTab,
  LeftColumnMainTab,
  LeftColumnProfileTab,
  LeftColumnSettingsTab,
  LeftColumnThemeTab,
} from './components';
import { TAB, variants } from './constants';
import { TabProvider } from './contexts';
import { useLeftColumn } from './hooks';

interface LeftColumnProps {
  hideWhenShrink?: boolean;
}

export const LeftColumn: React.FC<LeftColumnProps> = ({ hideWhenShrink = false }) => {
  const { state, functions } = useLeftColumn();

  return (
    <TabProvider
      tab={state.tab}
      setTab={functions.setTab}
    >
      <aside
        className={cn(
          'relative flex w-screen flex-col overflow-hidden border-r border-r-neutral-700',
          'lg:min-w-[400px] lg:max-w-[400px]',
          '2xl:min-w-[450px] 2xl:max-w-[450px]',
          hideWhenShrink && 'max-lg:hidden',
        )}
      >
        <AnimatePresence
          mode="popLayout"
          initial={false}
          custom={state.direction}
        >
          <motion.div
            key={state.tab}
            className="flex grow flex-col bg-neutral-900"
          >
            <motion.div
              className="flex grow flex-col bg-neutral-800"
              variants={variants}
              custom={state.direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ bounce: 0, duration: 0.25 }}
            >
              {
                {
                  [TAB.MAIN]: <LeftColumnMainTab />,
                  [TAB.SETTINGS]: <LeftColumnSettingsTab />,
                  [TAB.LANGUAGE]: <LeftColumnLanguageTab />,
                  [TAB.THEME]: <LeftColumnThemeTab />,
                  [TAB.PROFILE]: <LeftColumnProfileTab />,
                }[state.tab]
              }
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </aside>
    </TabProvider>
  );
};
