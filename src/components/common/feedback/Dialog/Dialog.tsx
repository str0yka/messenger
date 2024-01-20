import * as DialogPrimitive from '@radix-ui/react-dialog';
import cn from 'classnames';
import { forwardRef } from 'react';

const DialogRoot = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogDescription = DialogPrimitive.Description;

const DialogClose = DialogPrimitive.Close;

const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Content
    {...props}
    className={cn('absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2', className)}
    ref={ref}
  />
));

const DialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    {...props}
    className={cn('absolute inset-0 bg-black/20', className)}
    ref={ref}
  />
));

const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    {...props}
    className={cn('select-none text-lg font-semibold', className)}
    ref={ref}
  />
));

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
