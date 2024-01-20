import * as AvatarPrimitive from '@radix-ui/react-avatar';
import cn from 'classnames';
import { forwardRef } from 'react';

export const Avatar = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentProps<typeof AvatarPrimitive.Root> & { fallback: string }
>(({ fallback, className, ...props }, ref) => (
  <AvatarPrimitive.Root
    {...props}
    ref={ref}
    className={cn(
      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary-300 to-primary-500',
      className,
    )}
  >
    <AvatarPrimitive.Fallback className="text-md  font-semibold text-white">
      {fallback}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));
