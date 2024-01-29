import { forwardRef } from 'react';

import { useIntl } from '~/features/i18n';
import { createDate } from '~/utils/helpers';

interface DateButtonProps {
  date: Date;
}

export const DateButton = forwardRef<HTMLButtonElement, DateButtonProps>(({ date }, ref) => {
  const intl = useIntl();

  const { dayNumber, month } = createDate({
    date,
    locale: intl.locale,
  });

  return (
    <button
      ref={ref}
      className="select-none self-center rounded-3xl bg-neutral-950/40 px-2 py-1 text-sm font-medium text-neutral-50"
      type="button"
    >
      {dayNumber} {month}
    </button>
  );
});
