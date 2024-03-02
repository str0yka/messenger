import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import cn from 'classnames';
import { forwardRef } from 'react';

const RadioGroupRoot = RadioGroupPrimitive.Root;

const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    {...props}
    ref={ref}
    className={cn(
      'group relative cursor-pointer select-none rounded py-1.5 pl-8 pr-2 text-sm font-medium text-neutral-50 outline-none transition-colors',
      'focus:bg-neutral-300/10',
      'data-[disabled]:text-neutral-500',
      className,
    )}
  >
    <div
      className={cn(
        'absolute left-1 top-1/2 h-4  w-4 -translate-y-1/2 rounded-full border-2 border-primary-400 text-primary-400',
        'group-data-[disabled]:border-neutral-600 group-data-[disabled]:text-neutral-500',
      )}
    >
      <RadioGroupPrimitive.Indicator
        className={cn(
          'absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary-400',
          'group-data-[disabled]:bg-neutral-600',
        )}
      />
    </div>
    {children}
  </RadioGroupPrimitive.Item>
));

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};
