import * as DialogPrimitive from '@radix-ui/react-dialog';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const DialogRoot = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogDescription = DialogPrimitive.Description;

const DialogClose = DialogPrimitive.Close;

const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    {...props}
    className={className}
    ref={ref}
    asChild
  >
    <motion.div
      className="absolute left-[50%] top-[50%]"
      initial={{ y: '-40%', x: '-50%', opacity: 0 }}
      exit={{ y: '-40%', x: '-50%', opacity: 0 }}
      animate={{ y: '-50%', x: '-50%', opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  </DialogPrimitive.Content>
));

const DialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    {...props}
    className={cn(
      'absolute inset-0 bg-black/20',
      'data-[state=open]:duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className,
    )}
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
