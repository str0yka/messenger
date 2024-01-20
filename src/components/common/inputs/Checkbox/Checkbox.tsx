import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import cn from 'classnames';
import { forwardRef } from 'react';

import { IconCheck } from '../../icons';

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentProps<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    {...props}
    ref={ref}
    className={cn(
      'flex h-5 w-5 items-center justify-center rounded border-2 border-neutral-500',
      'data-[state=checked]:border-primary-400 data-[state=checked]:bg-primary-400',
      'data-[disabled]:animate-pulse',
      className,
    )}
  >
    <CheckboxPrimitive.CheckboxIndicator>
      <IconCheck className="h-5 w-5" />
    </CheckboxPrimitive.CheckboxIndicator>
  </CheckboxPrimitive.Root>
));
