import { useState } from 'react';

import { useIntl } from '~/features/i18n';
import { createDate } from '~/utils/helpers';

import { useSocket } from '../../../../../../../contexts';

interface UseDateButtonParams {
  date: Date;
}

export const useDateButton = ({ date }: UseDateButtonParams) => {
  const intl = useIntl();
  const socket = useSocket();

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);

  const {
    dayNumber: selectedDateDayNumber,
    dayShort: selectedDateDayShort,
    month: selectedDateMonth,
  } = createDate({
    date: selectedDate,
    locale: intl.locale,
  });

  const { dayNumber, month } = createDate({
    date,
    locale: intl.locale,
  });

  const onDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) setSelectedDate(date);
    setOpen(isOpen);
  };

  const onClickJumpToDate = () => {
    if (selectedDate) {
      setOpen(false);
      socket.emit('CLIENT:JUMP_TO_DATE', {
        timestamp: selectedDate.valueOf(),
        take: 80,
      });
    }
  };

  return {
    state: {
      isDialogOpen: open,
      dayNumber,
      month,
      selectedDateDayNumber,
      selectedDateDayShort,
      selectedDateMonth,
      selectedDate,
    },
    functions: {
      onDialogOpenChange,
      setSelectedDate,
      onClickJumpToDate,
    },
  };
};
