import cn from 'classnames';
import { useId, forwardRef } from 'react';

interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean;
  helperText?: string;
  rounded?: boolean;
  s?: 'base' | 'l' | 'xl';
  variant?: 'outlined' | 'contained';
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error = false,
      helperText,
      variant = 'outlined',
      rounded,
      s = 'base',
      startAdornment,
      endAdornment,
      ...props
    },
    ref,
  ) => {
    const additionalInputId = useId();
    const inputId = props.id || additionalInputId;

    return (
      <label
        htmlFor={inputId}
        data-error={error}
        className={cn(
          'group relative flex w-full cursor-text items-center  transition-all',
          'focus-within:outline focus-within:-outline-offset-1 focus-within:outline-primary-400',
          'aria-[disabled=true]:animate-pulse aria-[disabled=true]:bg-neutral-800',
          {
            'mb-5': !!helperText,
            'border-red-400 text-red-400': error,
            'focus-within:text-red-400 focus-within:outline-red-500': error,
            'rounded-full': rounded,
            'rounded-2xl': !rounded,
            'min-h-[40px] gap-2 px-4': s === 'base',
            'min-h-[48px] gap-2 px-4': s === 'l',
            'min-h-[56px] gap-2 px-4': s === 'xl',
            'border border-neutral-700 bg-neutral-900 text-neutral-600': variant === 'outlined',
            'focus-within:bg-neutral-800 focus-within:text-primary-400': variant === 'outlined',
            'bg-neutral-800 text-neutral-500': variant === 'contained',
          },
          props.className,
        )}
        aria-disabled={props.disabled}
      >
        <div className="shrink-0">{startAdornment}</div>
        <input
          type="text"
          id={inputId}
          {...props}
          ref={ref}
          size={1}
          className={cn(
            'grow self-stretch bg-transparent font-normal text-neutral-50 outline-none placeholder:select-none placeholder:text-neutral-500',
            'group-data-[error=true]:placeholder:text-red-400',
          )}
        />
        <div className="shrink-0">{endAdornment}</div>
        {helperText && (
          <p className="absolute -bottom-5 left-1 w-full truncate text-sm">{helperText}</p>
        )}
      </label>
    );
  },
);
