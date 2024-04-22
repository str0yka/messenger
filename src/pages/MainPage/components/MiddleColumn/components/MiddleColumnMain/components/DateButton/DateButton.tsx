import { Intl } from '~/components';
import { Button, Calendar, Dialog } from '~/components/common';

import { useDateButton } from './hooks';

interface DateButtonProps {
  date: Date;
}

export const DateButton: React.FC<DateButtonProps> = ({ date }) => {
  const { state, functions } = useDateButton({ date });

  return (
    <Dialog.Root
      open={state.isDialogOpen}
      onOpenChange={functions.onDialogOpenChange}
    >
      <Dialog.Trigger asChild>
        <button
          className="sticky top-2 select-none self-center rounded-3xl bg-neutral-950/40 px-2 py-1 text-sm font-medium text-neutral-50"
          type="button"
        >
          {state.dayNumber} {state.month}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="rounded-xl bg-neutral-800 p-4">
          <Dialog.Title>
            {state.selectedDateDayShort}, {state.selectedDateMonth} {state.selectedDateDayNumber}
          </Dialog.Title>
          <Calendar
            className="mb-4 mt-4"
            mode="single"
            defaultMonth={state.selectedDate}
            toMonth={new Date()}
            disabled={{ after: new Date() }}
            selected={state.selectedDate}
            onSelect={functions.setSelectedDate}
          />
          <div className="flex items-center justify-between gap-4">
            <Button onClick={functions.onClickJumpToDate}>
              <Intl path="page.home.middleColumn.dateDialog.jumpToDate" />
            </Button>
            <Dialog.Close asChild>
              <Button>
                <Intl path="page.home.middleColumn.dateDialog.cancel" />
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
