import cn from 'classnames';
import { forwardRef } from 'react';

interface IconButtonProps extends React.ComponentProps<'button'> {
  children: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      {...props}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full text-neutral-400',
        'hover:bg-neutral-700/50',
        'active:bg-neutral-700/75',
      )}
    >
      {children}
    </button>
  ),
);
