import cn from 'classnames';
import { useForm } from 'react-hook-form';

import { Button, Checkbox, Dialog } from '~/components/common';
import { useIntl } from '~/features/i18n';

interface DeleteMessageDialogProps extends React.ComponentProps<typeof Dialog.Root> {
  onDelete: (deleteForEveryone: boolean) => void;
}

export const DeleteMessageDialog: React.FC<DeleteMessageDialogProps> = ({
  onDelete,
  ...dialogRootProps
}) => {
  const intl = useIntl();
  const { handleSubmit, register } = useForm({ defaultValues: { deleteForEveryone: false } });

  return (
    <Dialog.Root {...dialogRootProps}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="w-72 rounded-xl bg-neutral-800 p-4">
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(({ deleteForEveryone }) => onDelete(deleteForEveryone))}
          >
            <Dialog.Title>
              {intl.t('page.home.middleColumn.deleteMessageDialog.title')}
            </Dialog.Title>
            <label
              className={cn(
                'flex cursor-pointer items-center gap-4 rounded-xl p-3',
                'hover:bg-neutral-700/50',
              )}
            >
              <Checkbox {...register('deleteForEveryone')} />
              <span className="font-medium">
                {intl.t('page.home.middleColumn.deleteMessageDialog.deleteForEveryone')}
              </span>
            </label>
            <div className="flex items-center justify-between gap-2">
              <Button type="submit">
                {intl.t('page.home.middleColumn.deleteMessageDialog.delete')}
              </Button>
              <Dialog.Close asChild>
                <Button>{intl.t('page.home.middleColumn.deleteMessageDialog.cancel')}</Button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
