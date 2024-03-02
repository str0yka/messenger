import cn from 'classnames';
import { useMutation } from 'react-query';

import { DropdownMenu, IconButton } from '~/components/common';
import {
  IconAtSign,
  IconBrush,
  IconChevronLeft,
  IconDotsVertical,
  IconEnvelopeClosed,
  IconInfoCircled,
  IconPencil,
  IconTranslate,
} from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { postLogout } from '~/utils/api';
import type { PostLogoutSuccessResponse, PostLogoutFailureResponse } from '~/utils/api';
import { getLanguage } from '~/utils/helpers';
import { useExtendedTheme } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

import { useSetTab } from '../../contexts';

export const LeftColumnSettingsTab = () => {
  const { user, resetUser } = useUserStore();
  const intl = useIntl();
  const { extendedTheme } = useExtendedTheme();

  const setTab = useSetTab();

  const logoutMutation = useMutation<PostLogoutSuccessResponse, PostLogoutFailureResponse>({
    mutationKey: 'LeftColumnLogoutMutation',
    mutationFn: postLogout,
    onSuccess: () => {
      resetUser();
    },
  });

  const language = getLanguage(intl.locale);

  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-b-neutral-700 px-4">
        <IconButton onClick={() => setTab('main')}>
          <IconChevronLeft className="h-6 w-6" />
        </IconButton>
        <span className="grow text-xl font-semibold">
          {intl.t('page.home.leftColumn.settings')}
        </span>
        <IconButton>
          <IconPencil className="h-6 w-6" />
        </IconButton>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <IconButton>
              <IconDotsVertical className="h-6 w-6" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item onClick={() => logoutMutation.mutate()}>
              {intl.t('page.home.logOut')}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="flex grow flex-col gap-3 bg-neutral-900 font-medium">
        <div className="flex flex-col bg-neutral-800 p-2">
          <button
            type="button"
            className={cn(
              'flex items-center gap-6 rounded-xl px-4 py-2',
              'hover:bg-neutral-600/50',
            )}
          >
            <IconEnvelopeClosed className="h-6 w-6 text-neutral-400" />
            <div className="flex flex-col items-start">
              {user?.email}
              <span className="text-sm text-neutral-400">
                {intl.t('page.home.leftColumn.settings.email')}
              </span>
            </div>
          </button>
          <button
            type="button"
            className={cn(
              'flex items-center gap-6 rounded-xl px-4 py-2',
              'hover:bg-neutral-600/50',
            )}
          >
            <IconAtSign className="h-6 w-6 text-neutral-400" />
            <div className="flex flex-col items-start">
              here need to display user username
              <span className="text-sm text-neutral-400">
                {intl.t('page.home.leftColumn.settings.username')}
              </span>
            </div>
          </button>
          <button
            type="button"
            className={cn(
              'flex items-center gap-6 rounded-xl px-4 py-2',
              'hover:bg-neutral-600/50',
            )}
          >
            <IconInfoCircled className="h-6 w-6 text-neutral-400" />
            <div className="flex flex-col items-start">
              here need to display user bio
              <span className="text-sm text-neutral-400">
                {intl.t('page.home.leftColumn.settings.bio')}
              </span>
            </div>
          </button>
        </div>
        <div className="flex flex-col bg-neutral-800 p-2">
          <button
            type="button"
            className={cn(
              'flex items-center gap-6 rounded-xl px-4 py-3',
              'hover:bg-neutral-600/50',
            )}
            onClick={() => setTab('language')}
          >
            <IconTranslate className="h-6 w-6 text-neutral-400" />
            <div className="flex grow items-center justify-between">
              {intl.t('page.home.leftColumn.settings.language')}
              <span className="text-neutral-400">{language.name}</span>
            </div>
          </button>
          <button
            type="button"
            className={cn(
              'flex items-center gap-6 rounded-xl px-4 py-3',
              'hover:bg-neutral-600/50',
            )}
          >
            <IconBrush className="h-6 w-6 text-neutral-400" />
            <div className="flex grow items-center justify-between">
              {intl.t('page.home.leftColumn.settings.theme')}
              <span className="text-neutral-400">{extendedTheme.name}</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};
