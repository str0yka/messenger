import { Input, IconButton, DropdownMenu } from '~/components/common';
import { IconGear } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useTheme } from '~/features/theme';
import { EXTENDED_THEMES, INTL_LANGUAGES } from '~/utils/constants';

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
                  {INTL_LANGUAGES.map((language) => (
                    <DropdownMenu.RadioItem value={language.locale}>English</DropdownMenu.RadioItem>
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
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-neutral-50">Messenger</h1>
        <p className="text-neutral-500">{intl.t('page.auth.logInText')}</p>
        <Input
          placeholder={intl.t('input.label.email')}
          type="email"
        />
        <Input
          placeholder={intl.t('input.label.password')}
          type="password"
        />
      </div>
    </main>
  );
};
