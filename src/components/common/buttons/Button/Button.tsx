import cn from 'classnames';
import { forwardRef } from 'react';

interface ButtonProps extends React.ComponentProps<'button'> {
  color?: 'primary' | 'warning' | 'error' | 'neutral' | 'success' | 'text';
  rounded?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<React.ElementRef<'button'>, ButtonProps>(
  ({ children, color = 'text', rounded = false, ...props }, ref) => (
    <button
      type="button"
      {...props}
      ref={ref}
      className={cn(
        'min-h-[2.5rem] w-full min-w-[2.5rem] font-medium transition-transform',
        'disabled:animate-pulse disabled:bg-neutral-700 disabled:text-neutral-50',
        'enabled:active:scale-95',
        {
          'text-primary-400': color === 'text',
          'hover:bg-primary-400/5': color === 'text',
          'active:bg-primary-400/10': color === 'text',

          'bg-primary-400 text-white': color === 'primary',
          'hover:bg-primary-500': color === 'primary',

          'bg-orange-400 text-white': color === 'warning',
          'hover:bg-orange-500': color === 'warning',

          'bg-red-400 text-white': color === 'error',
          'hover:bg-red-500': color === 'error',

          'bg-green-400 text-white': color === 'success',
          'hover:bg-green-500': color === 'success',

          'bg-neutral-400 text-white': color === 'neutral',
          'hover:bg-neutral-500': color === 'neutral',

          'rounded-full': rounded,
          'rounded-lg': !rounded,
        },
        props.className,
      )}
    >
      {children}
    </button>
  ),
);
