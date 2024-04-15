import { AnimatePresence, motion } from 'framer-motion';
import { Controller } from 'react-hook-form';

import { Intl } from '~/components';
import { DropdownMenu, IconButton, Input } from '~/components/common';
import { IconChevronLeft, IconHamburgerMenu, IconMagnifyingGlass } from '~/components/common/icons';

import { ChatList, SearchList } from './components';
import { MODE } from './constants';
import { useLeftColumnMainTab } from './hooks';

export const LeftColumnMainTab = () => {
  const { state, form, functions } = useLeftColumnMainTab();

  return (
    <>
      <div className="flex justify-between gap-2 border-b border-b-neutral-700 p-4">
        {state.mode === MODE.CHAT_LIST && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <motion.div
                initial={{ rotate: 180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <IconButton aria-label="Customise options">
                  <IconHamburgerMenu className="h-6 w-6" />
                </IconButton>
              </motion.div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="w-56"
              align="start"
            >
              <DropdownMenu.Label>
                <Intl path="page.home.settings" />
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={functions.onClickSettings}>
                <Intl path="page.home.leftColumn.settings" />
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={functions.onClickLogout}>
                <Intl path="page.home.logOut" />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
        {state.mode === MODE.SEARCH_LIST && (
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconButton onClick={functions.onCloseSearchList}>
              <IconChevronLeft className="h-6 w-6" />
            </IconButton>
          </motion.div>
        )}
        <div className="grow">
          <Controller
            name="query"
            control={form.control}
            render={({ field }) => (
              <Input
                rounded
                placeholder={functions.translate('page.home.leftColumn.input.placeholder')}
                startAdornment={<IconMagnifyingGlass />}
                onClick={functions.onOpenSearchList}
                {...field}
              />
            )}
          />
        </div>
      </div>
      <AnimatePresence
        initial={false}
        mode="wait"
      >
        <motion.div
          key={state.mode}
          className="flex grow flex-col overflow-auto"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {
            {
              [MODE.CHAT_LIST]: <ChatList />,
              [MODE.SEARCH_LIST]: (
                <SearchList
                  query={state.debouncedQuery}
                  onClose={functions.onCloseSearchList}
                />
              ),
            }[state.mode]
          }
        </motion.div>
      </AnimatePresence>
    </>
  );
};
