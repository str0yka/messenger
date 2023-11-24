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
      className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 outline-none hover:bg-neutral-700/50 focus-visible:bg-neutral-700/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 active:bg-neutral-700/75"
    >
      {children}
    </button>
  ),
);
