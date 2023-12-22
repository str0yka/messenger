import * as Avatar from '@radix-ui/react-avatar';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';

import { DropdownMenu, IconButton, Input } from '~/components/common';
import { IconHamburgerMenu, IconMagnifyingGlass } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useTheme } from '~/features/theme';
import { postLogout } from '~/utils/api';
import type { PostLogoutFailureResponse, PostLogoutSuccessResponse } from '~/utils/api';
import { EXTENDED_THEMES, LANGUAGES, PRIVATE_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../contexts';

export const LeftColumn = () => {
  const intl = useIntl();
  const { theme, setTheme } = useTheme();
  const resetUser = useUserStore((state) => state.resetUser);
  const socket = useSocket();

  const [dialogs, setDialogs] = useState<Parameters<ServerToClientEvents['dialogs:put']>['0']>([]);

  const { mutate: logoutMutation } = useMutation<
    PostLogoutSuccessResponse,
    PostLogoutFailureResponse
  >({
    mutationFn: postLogout,
    onSuccess: () => {
      resetUser();
    },
  });

  useEffect(() => {
    const onDialogsPut: ServerToClientEvents['dialogs:put'] = (ds) => {
      console.log('dialogs:put', ds);
      setDialogs(ds);
    };

    const onDialogsUpdateRequired: ServerToClientEvents['dialogs:updateRequired'] = () => {
      console.log('dialogs:updateRequired');
      socket.emit('dialogs:get');
    };

    socket.on('dialogs:put', onDialogsPut);
    socket.on('dialogs:updateRequired', onDialogsUpdateRequired);

    return () => {
      socket.off('dialogs:put', onDialogsPut);
      socket.off('dialogs:updateRequired', onDialogsUpdateRequired);
    };
  }, []);

  return (
    <aside
      className={cn(
        'flex w-full flex-col border-r border-r-neutral-700 bg-neutral-800',
        'lg:min-w-[400px] lg:max-w-[400px]',
        '2xl:min-w-[450px] 2xl:max-w-[450px]',
      )}
    >
      <div className="flex justify-between gap-2 border-b border-b-neutral-700 p-4">
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
        <div className="grow">
          <Input
            placeholder={intl.t('page.home.leftColumn.input.placeholder')}
            startAdornment={<IconMagnifyingGlass />}
          />
        </div>
      </div>
      <ul className="flex grow flex-col overflow-auto p-2">
        {dialogs.map((d, index) => (
          <li key={index}>
            <Link
              to={PRIVATE_ROUTE.USER(d.partnerId)}
              className={cn(
                'flex cursor-pointer select-none gap-2 rounded-lg p-2',
                'hover:bg-neutral-700/50',
                'active:bg-neutral-600/50',
              )}
            >
              <Avatar.Root className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary-300 to-primary-500">
                <Avatar.Fallback className="text-xl font-semibold text-white">
                  {d.partner.email[0]}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="flex min-w-[0] grow flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="grow truncate font-semibold text-neutral-50">{d.partner.email}</h2>
                  <p className="text-xs text-neutral-400">
                    {d.lastMessage &&
                      `${new Date(d.lastMessage.createdAt).getHours()}:${new Date(
                        d.lastMessage.createdAt,
                      ).getMinutes()}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="grow truncate text-neutral-400">{d.lastMessage?.message}</p>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-400 text-xs font-medium text-white">
                    2
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
