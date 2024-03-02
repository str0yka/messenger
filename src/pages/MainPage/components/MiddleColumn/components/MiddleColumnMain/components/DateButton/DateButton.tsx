import { useState } from 'react';

import { Button, Calendar, Dialog } from '~/components/common';
import { useIntl } from '~/features/i18n';
import { useSocket } from '~/pages/MainPage/contexts';
import { createDate } from '~/utils/helpers';

interface DateButtonProps {
  date: Date;
}

export const DateButton: React.FC<DateButtonProps> = ({ date }) => {
  const intl = useIntl();
  const socket = useSocket();

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);

  const { dayNumber, dayShort, month } = createDate({ date: selectedDate, locale: intl.locale });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setSelectedDate(date);
        setOpen(isOpen);
      }}
    >
      <Dialog.Trigger asChild>
        <button
          className="sticky top-2 select-none self-center rounded-3xl bg-neutral-950/40 px-2 py-1 text-sm font-medium text-neutral-50"
          type="button"
        >
          {dayNumber} {month}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="rounded-xl bg-neutral-800 p-4">
          <Dialog.Title>
            {dayShort}, {month} {dayNumber}
          </Dialog.Title>
          <Calendar
            className="mb-4 mt-4"
            mode="single"
            defaultMonth={selectedDate}
            toMonth={new Date()}
            disabled={{ after: new Date() }}
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => {
                if (selectedDate) {
                  setOpen(false);
                  socket.emit('CLIENT:JUMP_TO_DATE', {
                    timestamp: selectedDate.valueOf(),
                    take: 80,
                  });
                }
              }}
            >
              {intl.t('page.home.middleColumn.dateDialog.jumpToDate')}
            </Button>
            <Dialog.Close asChild>
              <Button>{intl.t('page.home.middleColumn.dateDialog.cancel')}</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
