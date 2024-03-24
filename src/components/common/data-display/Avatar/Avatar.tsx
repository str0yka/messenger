import * as AvatarPrimitive from '@radix-ui/react-avatar';
import cn from 'classnames';
import { forwardRef } from 'react';

const AvatarImage = AvatarPrimitive.Image;

const AvatarRoot = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentProps<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    {...props}
    ref={ref}
    className={cn(
      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary-300 to-primary-500',
      className,
    )}
  />
));

const AvatarFallback = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentProps<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    {...props}
    ref={ref}
    className={cn('text-md  font-semibold text-white', className)}
  />
));

export const Avatar = {
  Root: AvatarRoot,
  Fallback: AvatarFallback,
  Image: AvatarImage,
};
