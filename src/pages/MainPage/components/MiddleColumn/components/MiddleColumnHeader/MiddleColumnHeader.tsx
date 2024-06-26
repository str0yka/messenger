import cn from 'classnames';
import { Link } from 'react-router-dom';

import { Intl } from '~/components';
import { IconButton, Avatar, Dialog, DropdownMenu } from '~/components/common';
import {
  IconAtSign,
  IconBookmark,
  IconClosedLock,
  IconCross,
  IconDotsVertical,
  IconEnvelopeClosed,
  IconInfoCircled,
  IconOpenLock,
} from '~/components/common/icons';
import { PRIVATE_ROUTE, USER_STATUS } from '~/utils/constants';
import { getUserName } from '~/utils/helpers';

import { MiddleColumnHeaderSkeleton } from './components';
import { useMiddleColumnHeader } from './hooks';

export const MiddleColumnHeader = () => {
  const { state, functions } = useMiddleColumnHeader();

  if (!state.dialog) return <MiddleColumnHeaderSkeleton />;

  if (state.dialog.userId === state.dialog.partnerId) {
    return (
      <div className="flex cursor-pointer items-center gap-4 border-b border-b-neutral-700 bg-neutral-800 px-4 py-2">
        <div>
          <Link to={PRIVATE_ROUTE.HOME}>
            <IconButton>
              <IconCross />
            </IconButton>
          </Link>
        </div>
        <div className="relative">
          <Avatar.Root>
            <IconBookmark className="text-white" />
          </Avatar.Root>
        </div>
        <div className="flex flex-col items-start">
          <h2 className="truncate font-semibold text-neutral-50">
            <Intl path="savedMessages" />
          </h2>
        </div>
      </div>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="flex cursor-pointer items-center gap-4 border-b border-b-neutral-700 bg-neutral-800 px-4 py-2">
          <div>
            <Link to={PRIVATE_ROUTE.HOME}>
              <IconButton>
                <IconCross />
              </IconButton>
            </Link>
          </div>
          <div className="relative">
            <Avatar.Root>
              <Avatar.Image avatar={state.dialog.partner?.avatar} />
              <Avatar.Fallback>{getUserName(state.dialog.partner)[0]}</Avatar.Fallback>
            </Avatar.Root>
            {state.dialog.partner.status === USER_STATUS.ONLINE && (
              <div className="absolute bottom-[1.5px] right-[1.5px] h-2.5 w-2.5 rounded-full border-2 border-primary-900/25 bg-white" />
            )}
          </div>
          <div className="flex grow flex-col items-start">
            <h2 className="truncate font-semibold text-neutral-50">
              {getUserName(state.dialog.partner)}
            </h2>
            <p className="leading-3 text-neutral-400">
              {state.dialog.status === 'TYPING'
                ? functions.translate('page.home.middleColumn.header.typing')
                : functions.translate(`user.status.${state.dialog.partner.status}`)}
            </p>
          </div>
          <div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <IconButton>
                  <IconDotsVertical />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-56">
                {state.dialog.partnerBlocked && (
                  <DropdownMenu.Item
                    onClick={(event) => {
                      event.stopPropagation();
                      functions.onClickUnblock();
                    }}
                  >
                    <Intl path="page.home.middleColumn.header.unblock" />
                    <DropdownMenu.Shortcut>
                      <IconOpenLock />
                    </DropdownMenu.Shortcut>
                  </DropdownMenu.Item>
                )}
                {!state.dialog.partnerBlocked && (
                  <DropdownMenu.Item
                    onClick={(event) => {
                      event.stopPropagation();
                      functions.onClickBlock();
                    }}
                  >
                    <Intl path="page.home.middleColumn.header.block" />
                    <DropdownMenu.Shortcut>
                      <IconClosedLock />
                    </DropdownMenu.Shortcut>
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="w-72 rounded-xl bg-neutral-800 p-4">
          <div className="flex items-center gap-4">
            <Dialog.Close asChild>
              <IconButton>
                <IconCross />
              </IconButton>
            </Dialog.Close>
            <span className="grow text-lg font-medium">
              <Intl path="page.home.middleColumn.header.userInfo" />
            </span>
          </div>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative">
              <Avatar.Root className="h-28 w-28 text-4xl">
                <Avatar.Image avatar={state.dialog.partner?.avatar} />
                <Avatar.Fallback>{getUserName(state.dialog.partner)[0]}</Avatar.Fallback>
              </Avatar.Root>
              {state.dialog.partner.status === USER_STATUS.ONLINE && (
                <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-primary-900/25 bg-white" />
              )}
            </div>
            <div className="flex w-full flex-col items-center">
              <p className="w-full truncate text-center text-lg font-medium">
                {getUserName(state.dialog.partner)}
              </p>
              <p className="text-sm font-medium text-neutral-600">
                <Intl path={`user.status.${state.dialog.partner.status}`} />
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <button
              type="button"
              className={cn(
                'flex items-center gap-6 rounded-xl px-4 py-2',
                'hover:bg-neutral-600/50',
              )}
            >
              <IconEnvelopeClosed className="h-6 w-6 shrink-0 text-neutral-400" />
              <div className="flex flex-col items-start overflow-hidden">
                <span className="w-full truncate text-start">{state.dialog.partner.email}</span>
                <span className="text-sm text-neutral-400">
                  <Intl path="page.home.middleColumn.header.userInfo.email" />
                </span>
              </div>
            </button>
            {state.dialog.partner.username && (
              <button
                type="button"
                className={cn(
                  'flex items-center gap-6 rounded-xl px-4 py-2',
                  'hover:bg-neutral-600/50',
                )}
              >
                <IconAtSign className="h-6 w-6 shrink-0 text-neutral-400" />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="w-full truncate text-start">
                    {state.dialog.partner.username}
                  </span>
                  <span className="text-sm text-neutral-400">
                    <Intl path="page.home.middleColumn.header.userInfo.username" />
                  </span>
                </div>
              </button>
            )}
            {state.dialog.partner?.bio && (
              <button
                type="button"
                className={cn(
                  'flex items-center gap-6 rounded-xl px-4 py-2',
                  'hover:bg-neutral-600/50',
                )}
              >
                <IconInfoCircled className="h-6 w-6 shrink-0 text-neutral-400" />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="w-full truncate text-start">{state.dialog.partner.bio}</span>
                  <span className="text-sm text-neutral-400">
                    <Intl path="page.home.middleColumn.header.userInfo.bio" />
                  </span>
                </div>
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
