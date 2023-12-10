import cn from 'classnames';
import { forwardRef } from 'react';

interface IconButtonProps extends React.ComponentProps<'button'> {
  color?: 'primary' | 'warning' | 'error' | 'neutral' | 'success';
  children: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ color = 'neutral', children, ...props }, ref) => (
    <button
      type="button"
      {...props}
      ref={ref}
      className={cn('flex h-10 w-10 items-center justify-center rounded-full', {
        'bg-primary-400 text-white': color === 'primary',
        'hover:bg-primary-500': color === 'primary',
        'active:bg-primary-600': color === 'primary',

        'bg-red-400 text-white': color === 'error',
        'hover:bg-red-500': color === 'error',
        'active:bg-red-600': color === 'error',

        'bg-orange-400 text-white': color === 'warning',
        'hover:bg-orange-500': color === 'warning',
        'active:bg-orange-600': color === 'warning',

        'bg-green-400 text-white': color === 'success',
        'hover:bg-green-500': color === 'success',
        'active:bg-green-600': color === 'success',

        'text-neutral-400': color === 'neutral',
        'hover:bg-neutral-700/50': color === 'neutral',
        'active:bg-neutral-700/75': color === 'neutral',
      })}
    >
      {children}
    </button>
  ),
);
