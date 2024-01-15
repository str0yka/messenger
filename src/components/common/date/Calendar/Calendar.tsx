/* eslint-disable react/no-unstable-nested-components */
import cn from 'classnames';
import { DayPicker } from 'react-day-picker';

import { IconChevronLeft, IconChevronRight } from '~/components/common/icons';

type CalendarProps = React.ComponentProps<typeof DayPicker>;

export const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) => (
  <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn('p-2', className)}
    classNames={{
      months: 'flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0',
      month: 'space-y-4',
      caption: 'relative flex items-center justify-center pt-2',
      caption_label: 'select-none text-sm font-medium',
      nav: 'flex items-center space-x-1',
      nav_button: cn(
        'flex h-9 w-9 items-center justify-center rounded-full text-neutral-400',
        'hover:bg-neutral-700/50',
        'active:bg-neutral-700/75',
      ),
      nav_button_previous: 'absolute left-0',
      nav_button_next: 'absolute right-0',
      table: 'w-full border-collapse space-y-1',
      head_row: 'flex',
      head_cell:
        'flex h-9 w-9 select-none items-center justify-center rounded-md text-xs font-medium text-neutral-400',
      row: 'flex w-full',
      cell: 'w-9 h-9',
      day: cn(
        'flex h-9 w-9 cursor-pointer select-none items-center justify-center rounded-full text-xs font-medium',
        'hover:bg-neutral-700/50',
        'active:bg-neutral-700/75',
      ),
      day_selected: cn('bg-primary-400', 'hover:bg-primary-500'),
      day_today: 'bg-neutral-700/50',
      day_outside: 'opacity-50 aria-selected:bg-primary-400/50',
      day_disabled: 'opacity-50',
      day_range_start:
        'rounded-r-3xl aria-selected:bg-primary-400 aria-selected:hover:bg-primary-500',
      day_range_middle:
        'rounded-none aria-selected:bg-primary-400 aria-selected:hover:bg-primary-500',
      day_range_end:
        'rounded-l-3xl aria-selected:bg-primary-400 aria-selected:hover:bg-primary-500',
      day_hidden: 'invisible',
      ...classNames,
    }}
    components={{
      IconLeft: ({ className: iconLeftClassName, ...iconLeftProps }) => (
        <IconChevronLeft
          className={cn('h-6 w-6', iconLeftClassName)}
          {...iconLeftProps}
        />
      ),
      IconRight: ({ className: iconRightClassName, ...iconRightProps }) => (
        <IconChevronRight
          className={cn('h-6 w-6', iconRightClassName)}
          {...iconRightProps}
        />
      ),
    }}
    {...props}
  />
);
