import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'classnames';
import { Controller, useForm } from 'react-hook-form';

import { Intl } from '~/components';
import { Button, Checkbox, Dialog } from '~/components/common';

import { deleteMessageFormScheme } from './constants';
import type { DeleteMessageFormScheme } from './constants';

interface DeleteMessageDialogProps extends React.ComponentProps<typeof Dialog.Root> {
  onDelete: (deleteForEveryone: boolean) => void;
}

export const DeleteMessageDialog: React.FC<DeleteMessageDialogProps> = ({
  onDelete,
  ...dialogRootProps
}) => {
  const deleteMessageForm = useForm<DeleteMessageFormScheme>({
    defaultValues: { deleteForEveryone: false },
    resolver: zodResolver(deleteMessageFormScheme),
  });

  return (
    <Dialog.Root {...dialogRootProps}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="w-72 rounded-xl bg-neutral-800 p-4">
          <form
            className="flex flex-col gap-2"
            onSubmit={deleteMessageForm.handleSubmit(({ deleteForEveryone }) =>
              onDelete(deleteForEveryone),
            )}
          >
            <Dialog.Title>
              <Intl path="page.home.middleColumn.deleteMessageDialog.title" />
            </Dialog.Title>
            <label
              className={cn(
                'flex cursor-pointer items-center gap-4 rounded-xl p-3',
                'hover:bg-neutral-700/50',
              )}
            >
              <Controller
                name="deleteForEveryone"
                control={deleteMessageForm.control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <span className="font-medium">
                <Intl path="page.home.middleColumn.deleteMessageDialog.deleteForEveryone" />
              </span>
            </label>
            <div className="flex items-center justify-between gap-2">
              <Button type="submit">
                <Intl path="page.home.middleColumn.deleteMessageDialog.delete" />
              </Button>
              <Dialog.Close asChild>
                <Button>
                  <Intl path="page.home.middleColumn.deleteMessageDialog.cancel" />
                </Button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
