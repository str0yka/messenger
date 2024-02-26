import cn from 'classnames';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import { DropdownMenu, IconButton, Input } from '~/components/common';
import { IconChevronLeft, IconHamburgerMenu, IconMagnifyingGlass } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useTheme } from '~/features/theme';
import { postLogout } from '~/utils/api';
import type { PostLogoutFailureResponse, PostLogoutSuccessResponse } from '~/utils/api';
import { EXTENDED_THEMES, LANGUAGES } from '~/utils/constants';
import { useDebounce } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

import { LeftChatList, LeftSearchList } from './components';

interface LeftColumnProps {
  hideWhenShrink?: boolean;
}

export const LeftColumn: React.FC<LeftColumnProps> = ({ hideWhenShrink = false }) => {
  const intl = useIntl();
  const { theme, setTheme } = useTheme();
  const resetUser = useUserStore((state) => state.resetUser);

  const [mode, setMode] = useState<'chatList' | 'searchList'>('chatList');

  const logoutMutation = useMutation<PostLogoutSuccessResponse, PostLogoutFailureResponse>({
    mutationKey: 'LeftColumnLogoutMutation',
    mutationFn: postLogout,
    onSuccess: () => {
      resetUser();
    },
  });

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
    <aside
      className={cn(
        'flex w-screen flex-col border-r border-r-neutral-700 bg-neutral-800',
        'lg:min-w-[400px] lg:max-w-[400px]',
        '2xl:min-w-[450px] 2xl:max-w-[450px]',
        {
          'max-lg:hidden': hideWhenShrink,
        },
      )}
    >
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
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>Language</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.RadioGroup
                    value={intl.locale}
                    onValueChange={(value) => intl.setLocale(value as Locale)}
                  >
                    {LANGUAGES.map((language) => (
                      <DropdownMenu.RadioItem
                        key={language.locale}
                        value={language.locale}
                      >
                        {language.name}
                      </DropdownMenu.RadioItem>
                    ))}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>{intl.t('page.home.theme')}</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.RadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as Theme)}
                  >
                    {EXTENDED_THEMES.map((extendedTheme) => (
                      <DropdownMenu.RadioItem
                        key={extendedTheme.theme}
                        className="flex gap-1"
                        value={extendedTheme.theme}
                      >
                        <div className={`h-4 w-4 rounded-full ${extendedTheme.tailwind.bg}`} />
                        <div
                          className={`h-4 w-4 rounded-full ${
                            extendedTheme.mode === 'light' ? 'bg-white' : 'bg-black'
                          }`}
                        />
                      </DropdownMenu.RadioItem>
                    ))}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={() => logoutMutation.mutate()}>
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
      <motion.div
        key={mode}
        className="flex grow flex-col overflow-auto"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {mode === 'chatList' && <LeftChatList />}
        {mode === 'searchList' && (
          <LeftSearchList
            query={debouncedQuery}
            onClose={onCloseSearchList}
          />
        )}
      </motion.div>
    </aside>
  );
};
