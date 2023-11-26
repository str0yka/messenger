import cn from 'classnames';
import { useId } from 'react';

interface InputProps extends React.ComponentProps<'input'> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ startAdornment, endAdornment, ...props }) => {
  const inputId = useId();

  return (
    <label
      htmlFor={props.id || inputId}
      className={cn(
        'flex min-h-[40px] w-full cursor-text items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-4 text-neutral-700 transition-all',
        'focus-within:bg-neutral-800 focus-within:text-violet-400 focus-within:outline focus-within:-outline-offset-1 focus-within:outline-violet-400',
      )}
    >
      {startAdornment}
      <input
        type="text"
        id={inputId}
        {...props}
        className="flex-grow self-stretch bg-transparent font-normal text-neutral-50 outline-none placeholder:select-none placeholder:text-neutral-500"
      />
      {endAdornment}
    </label>
  );
};
