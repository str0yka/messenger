import cn from 'classnames';

import { Intl } from '~/components';
import { Avatar, DropdownMenu, IconButton } from '~/components/common';
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
import { getUserName } from '~/utils/helpers';

import { useLeftColumnSettingsTab } from './hooks';

export const LeftColumnSettingsTab = () => {
  const { state, functions } = useLeftColumnSettingsTab();

  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-b-neutral-700 px-4">
        <IconButton onClick={functions.goPreviousTab}>
          <IconChevronLeft className="h-6 w-6" />
        </IconButton>
        <span className="grow text-xl font-semibold">
          <Intl path="page.home.leftColumn.settings" />
        </span>
        <IconButton onClick={functions.goProfileTab}>
          <IconPencil className="h-6 w-6" />
        </IconButton>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <IconButton>
              <IconDotsVertical className="h-6 w-6" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item onClick={functions.onLogout}>
              <Intl path="page.home.logOut" />
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="flex grow flex-col gap-3 bg-neutral-900 font-medium">
        <div className="flex flex-col bg-neutral-800 p-2">
          <div className="flex flex-col items-center justify-center py-4">
            <Avatar.Root className="mb-2 h-28 w-28">
              <Avatar.Image avatar={state.user!.avatar} />
              <Avatar.Fallback>{getUserName(state.user!)[0]}</Avatar.Fallback>
            </Avatar.Root>
            <p className="w-full truncate text-center text-lg">{getUserName(state.user!)}</p>
            <p className="font-normal leading-4 text-neutral-400">
              <Intl path="user.status.ONLINE" />
            </p>
          </div>
          <button
            type="button"
            className={cn(
              'flex items-center gap-6 rounded-xl px-4 py-2',
              'hover:bg-neutral-600/50',
            )}
          >
            <IconEnvelopeClosed className="h-6 w-6 shrink-0 text-neutral-400" />
            <div className="flex flex-col items-start overflow-hidden">
              <span className="w-full truncate text-start">{state.user?.email}</span>
              <span className="text-sm text-neutral-400">
                <Intl path="page.home.leftColumn.settings.email" />
              </span>
            </div>
          </button>
          {state.user?.username && (
            <button
              type="button"
              className={cn(
                'flex items-center gap-6 rounded-xl px-4 py-2',
                'hover:bg-neutral-600/50',
              )}
            >
              <IconAtSign className="h-6 w-6 shrink-0 text-neutral-400" />
              <div className="flex flex-col items-start overflow-hidden">
                <span className="w-full truncate text-start">{state.user.username}</span>
                <span className="text-sm text-neutral-400">
                  <Intl path="page.home.leftColumn.settings.username" />
                </span>
              </div>
            </button>
          )}
          {state.user?.bio && (
            <button
              type="button"
              className={cn(
                'flex items-center gap-6 rounded-xl px-4 py-2',
                'hover:bg-neutral-600/50',
              )}
            >
              <IconInfoCircled className="h-6 w-6 shrink-0 text-neutral-400" />
              <div className="flex flex-col items-start overflow-hidden">
                <span className="w-full truncate text-start">{state.user.bio}</span>
                <span className="text-sm text-neutral-400">
                  <Intl path="page.home.leftColumn.settings.bio" />
                </span>
              </div>
            </button>
          )}
        </div>
        <div className="flex flex-col bg-neutral-800 p-2">
          <button
            type="button"
            className={cn(
              'flex items-center gap-6 rounded-xl px-4 py-3',
              'hover:bg-neutral-600/50',
            )}
            onClick={functions.goLanguageTab}
          >
            <IconTranslate className="h-6 w-6 text-neutral-400" />
            <div className="flex grow items-center justify-between">
              <Intl path="page.home.leftColumn.settings.language" />
              <span className="text-neutral-400">{state.language.name}</span>
            </div>
          </button>
          <button
            type="button"
            className={cn(
              'flex items-center gap-6 rounded-xl px-4 py-3',
              'hover:bg-neutral-600/50',
            )}
            onClick={functions.goThemeTab}
            aria-label={functions.translate('page.home.leftColumn.settings.theme')}
          >
            <IconBrush className="h-6 w-6 text-neutral-400" />
            <div className="flex grow items-center justify-between">
              <Intl path="page.home.leftColumn.settings.theme" />
              <span className="text-neutral-400">
                <Intl path={state.extendedTheme.intl} />
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};
