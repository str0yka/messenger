import { forwardRef } from 'react';

import { IconButton } from '~/components/common';
import { IconChevronDown } from '~/components/common/icons';

import { useScrollDownButton } from './hooks';

interface ScrollDownButtonProps extends React.ComponentProps<typeof IconButton> {}

export const ScrollDownButton = forwardRef<HTMLDivElement, ScrollDownButtonProps>((props, ref) => {
  const { state } = useScrollDownButton();

  return (
    <div
      ref={ref}
      className="absolute bottom-0 right-3"
    >
      <IconButton {...props}>
        <IconChevronDown />
      </IconButton>
      {!!state.unreadedMessagesCount && (
        <div className="pointer-events-none absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-400 text-xs">
          {state.unreadedMessagesCount}
        </div>
      )}
    </div>
  );
});
