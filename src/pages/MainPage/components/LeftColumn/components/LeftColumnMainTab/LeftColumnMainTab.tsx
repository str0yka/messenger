import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DropdownMenu, IconButton, Input } from '~/components/common';
import { IconChevronLeft, IconHamburgerMenu, IconMagnifyingGlass } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useLogoutMutation } from '~/utils/api';
import { useDebounce } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

import { TAB } from '../../constants';
import { useSetTab } from '../../contexts';

import { LeftChatList, LeftSearchList } from './components';

export const LeftColumnMainTab = () => {
  const intl = useIntl();
  const resetUser = useUserStore((state) => state.resetUser);

  const setTab = useSetTab();

  const [mode, setMode] = useState<'chatList' | 'searchList'>('chatList');

  const logoutMutation = useLogoutMutation({ onSuccess: resetUser });

  const searchForm = useForm({
    defaultValues: {
      query: '',
    },
  });

  const debouncedQuery = useDebounce(searchForm.watch('query'));

  const onCloseSearchList = () => {
    setMode('chatList');
    searchForm.reset({ query: '' });
  };

  return (
    <>
      <div className="flex justify-between gap-2 border-b border-b-neutral-700 p-4">
        {mode === 'chatList' && (
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
              <DropdownMenu.Label>{intl.t('page.home.settings')}</DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={() => setTab(TAB.SETTINGS)}>
                {intl.t('page.home.leftColumn.settings')}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={() => logoutMutation.mutateAsync({})}>
                {intl.t('page.home.logOut')}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
        {mode === 'searchList' && (
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconButton onClick={onCloseSearchList}>
              <IconChevronLeft className="h-6 w-6" />
            </IconButton>
          </motion.div>
        )}
        <div className="grow">
          <Controller
            name="query"
            control={searchForm.control}
            render={({ field }) => (
              <Input
                placeholder={intl.t('page.home.leftColumn.input.placeholder')}
                startAdornment={<IconMagnifyingGlass />}
                rounded
                onClick={() => setMode('searchList')}
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
          key={mode}
          className="flex grow flex-col overflow-auto"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {
            {
              chatList: <LeftChatList />,
              searchList: (
                <LeftSearchList
                  query={debouncedQuery}
                  onClose={onCloseSearchList}
                />
              ),
            }[mode]
          }
        </motion.div>
      </AnimatePresence>
    </>
  );
};
