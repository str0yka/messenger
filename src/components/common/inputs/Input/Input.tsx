import cn from 'classnames';
import { useId, forwardRef } from 'react';

interface InputProps extends React.ComponentProps<'input'> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ startAdornment, endAdornment, ...props }, ref) => {
    const inputId = useId();

    return (
      <label
        htmlFor={props.id || inputId}
        className={cn(
          'flex min-h-[40px] w-full cursor-text items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-4 text-neutral-600 transition-all',
          'focus-within:bg-neutral-800 focus-within:text-primary-400 focus-within:outline focus-within:-outline-offset-1 focus-within:outline-primary-400',
          'aria-[disabled=true]:animate-pulse aria-[disabled=true]:bg-neutral-800',
        )}
        aria-disabled={props.disabled}
      >
        <div>{startAdornment}</div>
        <input
          type="text"
          id={props.id || inputId}
          {...props}
          ref={ref}
          className="grow self-stretch bg-transparent font-normal text-neutral-50 outline-none placeholder:select-none placeholder:text-neutral-500"
        />
        <div>{endAdornment}</div>
      </label>
    );
  },
);
