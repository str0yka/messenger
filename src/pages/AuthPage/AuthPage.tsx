import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import cn from 'classnames';

import { Input, IconButton } from '~/components/common';
import { IconBrush } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useTheme } from '~/features/theme';
import { THEME } from '~/utils/constants';

export const AuthPage = () => {
  const intl = useIntl();
  const { theme, setTheme } = useTheme();

  return (
    <main className="flex h-screen items-center justify-center bg-neutral-900">
      <div className="absolute right-4 top-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <IconButton aria-label="Select theme">
              <IconBrush />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="flex flex-col gap-2 rounded bg-neutral-800 p-2"
            >
              <DropdownMenu.Item
                className={cn(
                  'flex cursor-pointer gap-1 p-2',
                  'rounded hover:bg-neutral-300/10',
                  theme === THEME.VIOLET_LIGHT && 'bg-neutral-300/20',
                )}
                onClick={() => setTheme(THEME.VIOLET_LIGHT)}
              >
                <div className="h-4 w-4 rounded-full bg-white shadow-lg" />
                <div className="h-4 w-4 rounded-full bg-violet-400 shadow" />
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className={cn(
                  'flex cursor-pointer gap-1 p-2',
                  'rounded hover:bg-neutral-300/10',
                  theme === THEME.VIOLET_DARK && 'bg-neutral-300/5',
                )}
                onClick={() => setTheme(THEME.VIOLET_DARK)}
              >
                <div className="h-4 w-4 rounded-full bg-black shadow" />
                <div className="h-4 w-4 rounded-full bg-violet-400 shadow" />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
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
