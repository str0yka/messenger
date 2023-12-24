import cn from 'classnames';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import { DropdownMenu, IconButton, Input } from '~/components/common';
import { IconChevron, IconHamburgerMenu, IconMagnifyingGlass } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useTheme } from '~/features/theme';
import { postLogout } from '~/utils/api';
import type { PostLogoutFailureResponse, PostLogoutSuccessResponse } from '~/utils/api';
import { EXTENDED_THEMES, LANGUAGES } from '~/utils/constants';
import { useDebounce } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

import { LeftChatList, LeftSearchList } from './components';

export const LeftColumn = () => {
  const intl = useIntl();
  const { theme, setTheme } = useTheme();
  const resetUser = useUserStore((state) => state.resetUser);

  const [mode, setMode] = useState<'chatList' | 'searchList'>('chatList');

  const { mutate: logoutMutation } = useMutation<
    PostLogoutSuccessResponse,
    PostLogoutFailureResponse
  >({
    mutationFn: postLogout,
    onSuccess: () => {
      resetUser();
    },
  });

  const { control, watch, reset } = useForm({
    defaultValues: {
      query: '',
    },
  });

  const debouncedQuery = useDebounce(watch('query'));

  const onCloseSearchList = () => {
    setMode('chatList');
    reset({ query: '' });
  };

  return (
    <aside
      className={cn(
        'flex w-full flex-col border-r border-r-neutral-700 bg-neutral-800',
        'lg:min-w-[400px] lg:max-w-[400px]',
        '2xl:min-w-[450px] 2xl:max-w-[450px]',
      )}
    >
      <div className="flex justify-between gap-2 border-b border-b-neutral-700 p-4">
        {mode === 'chatList' && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <IconButton aria-label="Customise options">
                <IconHamburgerMenu />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="w-[250px]"
              align="start"
            >
              <DropdownMenu.Label>{intl.t('page.home.settings')}</DropdownMenu.Label>
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
              <DropdownMenu.Item onClick={() => logoutMutation()}>
                {intl.t('page.home.logOut')}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
        {mode === 'searchList' && (
          <IconButton onClick={onCloseSearchList}>
            <IconChevron direction="left" />
          </IconButton>
        )}
        <div className="grow">
          <Controller
            name="query"
            control={control}
            render={({ field }) => (
              <Input
                placeholder={intl.t('page.home.leftColumn.input.placeholder')}
                startAdornment={<IconMagnifyingGlass />}
                onClick={() => setMode('searchList')}
                {...field}
              />
            )}
          />
        </div>
      </div>
      {mode === 'chatList' && <LeftChatList />}
      {mode === 'searchList' && (
        <LeftSearchList
          query={debouncedQuery}
          onClose={onCloseSearchList}
        />
      )}
    </aside>
  );
};
