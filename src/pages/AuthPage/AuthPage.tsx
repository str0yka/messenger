import * as Tabs from '@radix-ui/react-tabs';
import cn from 'classnames';

import { Input, IconButton, DropdownMenu, Button } from '~/components/common';
import { IconGear } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useTheme } from '~/features/theme';
import { EXTENDED_THEMES, LANGUAGES } from '~/utils/constants';

export const AuthPage = () => {
  const intl = useIntl();
  const { theme, setTheme } = useTheme();

  return (
    <main className="flex h-screen items-center justify-center bg-neutral-900">
      <div className="absolute right-4 top-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <IconButton aria-label="Select theme">
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
                    <DropdownMenu.RadioItem value={language.locale}>
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
      <Tabs.Root
        className="flex w-[350px] flex-col"
        defaultValue="login"
      >
        <Tabs.List className="flex border-b border-neutral-700">
          <Tabs.Trigger
            className={cn(
              'h-12 flex-1 bg-neutral-800 font-medium text-neutral-50 first:rounded-tl last:rounded-tr',
              'data-[state=active]:border-b data-[state=active]:text-primary-400 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]',
            )}
            value="login"
          >
            Log in
          </Tabs.Trigger>
          <Tabs.Trigger
            className={cn(
              'h-12 flex-1 bg-neutral-800 font-medium text-neutral-50 first:rounded-tl last:rounded-tr',
              'data-[state=active]:border-b data-[state=active]:text-primary-400  data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]',
            )}
            value="register"
          >
            Register
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="rounded-b bg-neutral-800 p-5"
          value="login"
        >
          <div className="flex h-full  flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
            <p className="text-center text-neutral-500">{intl.t('page.auth.logInText')}</p>
            <Input
              placeholder={intl.t('input.label.email')}
              type="email"
            />
            <Input
              placeholder={intl.t('input.label.password')}
              type="password"
            />
            <Button>Log in</Button>
          </div>
        </Tabs.Content>
        <Tabs.Content
          className="rounded-b bg-neutral-800 p-5"
          value="register"
        >
          <div className="flex h-full  flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
            <p className="text-center text-neutral-500">{intl.t('page.auth.registerText')}</p>
            <Input
              placeholder={intl.t('input.label.email')}
              type="email"
            />
            <Input
              placeholder={intl.t('input.label.password')}
              type="password"
            />
            <Button>Register</Button>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </main>
  );
};
