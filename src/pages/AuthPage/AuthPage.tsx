import cn from 'classnames';

import { Intl } from '~/components';
import { IconButton, DropdownMenu, Tabs } from '~/components/common';
import { IconGear } from '~/components/common/icons';
import { EXTENDED_THEMES, LANGUAGES } from '~/utils/constants';

import { Login, Registration } from './components';
import { useAuthPage } from './hooks';

export const AuthPage = () => {
  const { state, functions } = useAuthPage();

  return (
    <main className="flex h-screen items-center justify-center bg-neutral-900">
      <Tabs.Root defaultValue="login">
        <Tabs.List className="flex border-b border-neutral-700">
          <Tabs.Trigger value="login">
            <Intl path="page.auth.tabs.trigger.logIn" />
          </Tabs.Trigger>
          <Tabs.Trigger value="register">
            <Intl path="page.auth.tabs.trigger.register" />
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="login">
          <div className="flex flex-col items-center gap-4 rounded-b bg-neutral-800 p-5">
            <Login />
          </div>
        </Tabs.Content>
        <Tabs.Content value="register">
          <div className="flex flex-col items-center gap-4 rounded-b bg-neutral-800 p-5">
            <Registration />
          </div>
        </Tabs.Content>
      </Tabs.Root>
      <div className="absolute right-4 top-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <IconButton aria-label="Settings">
              <IconGear />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            align="end"
            className="w-56"
          >
            <DropdownMenu.Label>
              <Intl path="page.auth.settings" />
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>Language</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.RadioGroup
                  value={state.locale}
                  onValueChange={functions.handleChangeLocale}
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
              <DropdownMenu.SubTrigger>
                <Intl path="page.auth.theme" />
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.RadioGroup
                  value={state.theme}
                  onValueChange={functions.handleChangeTheme}
                >
                  {EXTENDED_THEMES.map((extendedTheme) => (
                    <DropdownMenu.RadioItem
                      key={extendedTheme.theme}
                      className="flex gap-1"
                      value={extendedTheme.theme}
                    >
                      <div className={cn('h-4 w-4 rounded-full', extendedTheme.tailwind.bg)} />
                      <div
                        className={cn('h-4 w-4 rounded-full', {
                          'bg-white': extendedTheme.mode === 'light',
                          'bg-black': extendedTheme.mode === 'dark',
                        })}
                      />
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </main>
  );
};
