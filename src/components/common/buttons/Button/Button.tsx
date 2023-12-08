import cn from 'classnames';
import { forwardRef } from 'react';

interface ButtonProps extends React.ComponentProps<'button'> {
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => (
  <button
    type="button"
    {...props}
    ref={ref}
    className={cn(
      'min-h-[2.5rem] w-full min-w-[2.5rem] rounded-full bg-primary-400 font-medium text-white transition-transform',
      'hover:bg-primary-500',
      'active:scale-95',
    )}
  >
    {children}
  </button>
));
