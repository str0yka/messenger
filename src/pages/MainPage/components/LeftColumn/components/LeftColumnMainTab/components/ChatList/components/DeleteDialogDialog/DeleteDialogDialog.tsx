import cn from 'classnames';
import { Controller } from 'react-hook-form';

import { Intl } from '~/components';
import { Button, Checkbox, Dialog } from '~/components/common';

import { useDeleteDialogDialog } from './hooks';

interface DeleteDialogDialogProps extends React.ComponentProps<typeof Dialog.Root> {
  onDelete: (deleteForEveryone: boolean) => void;
}

export const DeleteDialogDialog: React.FC<DeleteDialogDialogProps> = ({ onDelete, ...props }) => {
  const { form, functions } = useDeleteDialogDialog({ onDelete });

  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="w-72 rounded-xl bg-neutral-800 p-4">
          <form
            className="flex flex-col gap-2"
            onSubmit={functions.onSubmit}
          >
            <Dialog.Title>
              <Intl path="page.home.leftColumn.chatList.deleteDialogDialog.title" />
            </Dialog.Title>
            <label
              className={cn(
                'flex cursor-pointer items-center gap-4 rounded-xl p-3',
                'hover:bg-neutral-700/50',
              )}
            >
              <Controller
                name="deleteForEveryone"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <span className="font-medium">
                <Intl path="page.home.leftColumn.chatList.deleteDialogDialog.deleteForEveryone" />
              </span>
            </label>
            <div className="flex items-center justify-between gap-2">
              <Button type="submit">
                <Intl path="page.home.leftColumn.chatList.deleteDialogDialog.delete" />
              </Button>
              <Dialog.Close asChild>
                <Button>
                  <Intl path="page.home.leftColumn.chatList.deleteDialogDialog.cancel" />
                </Button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
