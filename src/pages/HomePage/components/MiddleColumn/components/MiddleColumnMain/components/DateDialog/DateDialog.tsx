import { Button, Calendar, Dialog } from '~/components/common';

interface DateDialogProps {
  children: React.ReactNode;
}

export const DateDialog: React.FC<DateDialogProps> = ({ children }) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>{children}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content className="rounded-xl bg-neutral-800 p-4">
        <Dialog.Title>Sat, January 13</Dialog.Title>
        <Calendar className="mb-4 mt-4" />
        <div className="flex items-center justify-between gap-4">
          <Button>TO DATE</Button>
          <Dialog.Close asChild>
            <Button>CANCEL</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
