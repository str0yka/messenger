import cn from 'classnames';
import { useId, forwardRef } from 'react';

interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, helperText, startAdornment, endAdornment, ...props }, ref) => {
    const inputId = useId();

    return (
      <label
        htmlFor={props.id || inputId}
        data-error={error}
        className={cn(
          'group relative flex min-h-[40px] w-full cursor-text items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-4 text-neutral-600 transition-all',
          'focus-within:bg-neutral-800 focus-within:text-primary-400 focus-within:outline focus-within:-outline-offset-1 focus-within:outline-primary-400',
          'aria-[disabled=true]:animate-pulse aria-[disabled=true]:bg-neutral-800',
          {
            'mb-5': !!helperText,
            'border-red-400 text-red-400': error,
            'focus-within:text-red-400 focus-within:outline-red-500': error,
          },
          props.className,
        )}
        aria-disabled={props.disabled}
      >
        <div>{startAdornment}</div>
        <input
          type="text"
          id={props.id || inputId}
          {...props}
          ref={ref}
          className={cn(
            'grow self-stretch bg-transparent font-normal text-neutral-50 outline-none placeholder:select-none placeholder:text-neutral-500',
            'group-data-[error=true]:placeholder:text-red-400',
          )}
        />
        <div>{endAdornment}</div>
        {helperText && (
          <p className="absolute -bottom-5 left-1 w-full truncate text-sm">{helperText}</p>
        )}
      </label>
    );
  },
);
