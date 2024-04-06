import cn from 'classnames';

import { Avatar, Dialog, IconButton, Input } from '~/components/common';
import { IconBookmark, IconCross } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useDialogsQuery } from '~/utils/api';
import { getUserName } from '~/utils/helpers';

interface ForwardMessageDialogProps extends React.ComponentProps<typeof Dialog.Root> {
  onForward: (dialog: Dialog) => void;
}

export const ForwardMessageDialog: React.FC<ForwardMessageDialogProps> = ({
  onForward,
  ...dialogRootProps
}) => {
  const intl = useIntl();

  const dialogsQuery = useDialogsQuery();

  return (
    <Dialog.Root {...dialogRootProps}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="flex w-72 flex-col gap-4 rounded-xl bg-neutral-800 p-4">
          <div className="flex items-center gap-2">
            <div>
              <Dialog.Close asChild>
                <IconButton>
                  <IconCross />
                </IconButton>
              </Dialog.Close>
            </div>
            <Input placeholder="Переслать..." />
          </div>
          <div className="flex h-96 flex-col overflow-auto">
            {dialogsQuery.data?.dialogs.pinned
              .concat(dialogsQuery.data.dialogs.unpinned)
              .map((dialog) => (
                <div
                  key={dialog.id}
                  className={cn(
                    'flex select-none items-center gap-4 rounded-lg bg-neutral-800 p-2',
                    'hover:bg-neutral-700',
                  )}
                  role="button"
                  tabIndex={0}
                  aria-hidden
                  onClick={() => onForward(dialog)}
                >
                  <Avatar.Root>
                    {dialog.userId === dialog.partnerId && <IconBookmark className="text-white" />}
                    {dialog.userId !== dialog.partnerId && (
                      <Avatar.Fallback>{getUserName(dialog.partner)[0]}</Avatar.Fallback>
                    )}
                  </Avatar.Root>
                  <div className="flex flex-col">
                    {dialog.userId === dialog.partnerId && intl.t('savedMessages')}
                    {dialog.userId !== dialog.partnerId && getUserName(dialog.partner)}
                    <span className="text-sm leading-4 text-neutral-500">
                      {dialog.userId === dialog.partnerId &&
                        intl.t(
                          'page.home.middleColumn.forwardMessageDialog.savedMessages.description',
                        )}
                      {dialog.userId !== dialog.partnerId &&
                        intl.t(`user.status.${dialog.partner.status}`)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
