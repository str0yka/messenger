import { IconButton, DropdownMenu, Tabs } from '~/components/common';
import { IconGear } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useTheme } from '~/features/theme';
import { EXTENDED_THEMES, LANGUAGES } from '~/utils/constants';

import { Login, Registration } from './components';

export const AuthPage = () => {
  const intl = useIntl();
  const { theme, setTheme } = useTheme();

  return (
    <main className="flex h-screen items-center justify-center bg-neutral-900">
      <Tabs.Root defaultValue="login">
        <Tabs.List className="flex border-b border-neutral-700">
          <Tabs.Trigger value="login">{intl.t('page.auth.tabs.trigger.logIn')}</Tabs.Trigger>
          <Tabs.Trigger value="register">{intl.t('page.auth.tabs.trigger.register')}</Tabs.Trigger>
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
          <DropdownMenu.Content align="end">
            <DropdownMenu.Label>{intl.t('page.auth.settings')}</DropdownMenu.Label>
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
              <DropdownMenu.SubTrigger>{intl.t('page.auth.theme')}</DropdownMenu.SubTrigger>
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
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </main>
  );
};
