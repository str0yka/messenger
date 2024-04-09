import cn from 'classnames';
import { Link } from 'react-router-dom';

import { IconButton, Avatar, Dialog } from '~/components/common';
import {
  IconAtSign,
  IconBookmark,
  IconCross,
  IconEnvelopeClosed,
  IconInfoCircled,
} from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { PRIVATE_ROUTE, USER_STATUS } from '~/utils/constants';
import { getUserName } from '~/utils/helpers';

import { useDialog } from '../../../../contexts';

export const MiddleColumnHeader = () => {
  const intl = useIntl();

  const dialog = useDialog();

  if (!dialog) return null; // $FIXME

  if (dialog.userId === dialog.partnerId) {
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
          <h2 className="truncate font-semibold text-neutral-50">{intl.t('savedMessages')}</h2>
        </div>
      </div>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
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
              <Avatar.Image avatar={dialog.partner?.avatar} />
              <Avatar.Fallback>{getUserName(dialog.partner)[0]}</Avatar.Fallback>
            </Avatar.Root>
            {dialog.partner.status === USER_STATUS.ONLINE && (
              <div className="absolute bottom-[1.5px] right-[1.5px] h-2.5 w-2.5 rounded-full border-2 border-primary-900/25 bg-white" />
            )}
          </div>
          <div className="flex flex-col items-start">
            <h2 className="truncate font-semibold text-neutral-50">
              {getUserName(dialog.partner)}
            </h2>
            <p className="leading-3 text-neutral-400">
              {dialog.status === 'TYPING'
                ? intl.t('page.home.middleColumn.header.typing')
                : intl.t(`user.status.${dialog.partner.status}`)}
            </p>
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
              {intl.t('page.home.middleColumn.header.userInfo')}
            </span>
          </div>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative">
              <Avatar.Root className="h-28 w-28 text-4xl">
                <Avatar.Image avatar={dialog.partner?.avatar} />
                <Avatar.Fallback>{getUserName(dialog.partner)[0]}</Avatar.Fallback>
              </Avatar.Root>
              {dialog.partner.status === USER_STATUS.ONLINE && (
                <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-primary-900/25 bg-white" />
              )}
            </div>
            <div className="flex w-full flex-col items-center">
              <p className="w-full truncate text-center text-lg font-medium">
                {getUserName(dialog.partner)}
              </p>
              <p className="text-sm font-medium text-neutral-600">
                {intl.t(`user.status.${dialog.partner.status}`)}
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
                <span className="w-full truncate text-start">{dialog.partner.email}</span>
                <span className="text-sm text-neutral-400">
                  {intl.t('page.home.middleColumn.header.userInfo.email')}
                </span>
              </div>
            </button>
            {dialog.partner.username && (
              <button
                type="button"
                className={cn(
                  'flex items-center gap-6 rounded-xl px-4 py-2',
                  'hover:bg-neutral-600/50',
                )}
              >
                <IconAtSign className="h-6 w-6 shrink-0 text-neutral-400" />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="w-full truncate text-start">{dialog.partner.username}</span>
                  <span className="text-sm text-neutral-400">
                    {intl.t('page.home.middleColumn.header.userInfo.username')}
                  </span>
                </div>
              </button>
            )}
            {dialog.partner?.bio && (
              <button
                type="button"
                className={cn(
                  'flex items-center gap-6 rounded-xl px-4 py-2',
                  'hover:bg-neutral-600/50',
                )}
              >
                <IconInfoCircled className="h-6 w-6 shrink-0 text-neutral-400" />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="w-full truncate text-start">{dialog.partner.bio}</span>
                  <span className="text-sm text-neutral-400">
                    {intl.t('page.home.middleColumn.header.userInfo.bio')}
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
