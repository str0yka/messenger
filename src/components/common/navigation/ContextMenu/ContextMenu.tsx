import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import cn from 'classnames';
import { forwardRef } from 'react';

import { IconCheck, IconChevronRight } from '~/components/common/icons';

// ContextMenuRoot

const ContextMenuRoot = ContextMenuPrimitive.Root;

// ContextMenuTrigger

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

// ContextMenuGroup

const ContextMenuGroup = ContextMenuPrimitive.Group;

// ContextMenuPortal

const ContextMenuPortal = ContextMenuPrimitive.Portal;

// ContextMenuRadioGroup

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

// ContextMenuSub

const ContextMenuSub = ContextMenuPrimitive.Sub;

// ContextMenuContent

const ContextMenuContent = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      {...props}
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded bg-neutral-800 p-1 shadow-lg',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
    />
  </ContextMenuPrimitive.Portal>
));

// ContextMenuItem

const ContextMenuItem = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    {...props}
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm font-medium text-neutral-50 outline-none',
      'focus:bg-neutral-300/10',
      'data-[disabled]:pointer-events-none data-[disabled]:text-neutral-500',
      className,
    )}
  />
));

// ContextMenuCheckboxItem

const ContextMenuCheckboxItem = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, checked, children, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    {...props}
    ref={ref}
    checked={checked}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded py-1.5 pl-8 pr-2 text-sm font-medium text-neutral-50 outline-none transition-colors',
      'focus:bg-neutral-300/10',
      'data-[disabled]:pointer-events-none data-[disabled]:text-neutral-500',
      className,
    )}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <IconCheck className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));

// ContextMenuRadioItem

const ContextMenuRadioItem = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
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
      <ContextMenuPrimitive.ItemIndicator
        className={cn(
          'absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary-400',
          'group-data-[disabled]:bg-neutral-600',
        )}
      />
    </div>
    {children}
  </ContextMenuPrimitive.RadioItem>
));

// ContextMenuSubTrigger

const ContextMenuSubTrigger = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    {...props}
    className={cn(
      'flex cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm font-medium text-neutral-50 outline-none',
      'focus:bg-neutral-300/10',
      'data-[state=open]:bg-neutral-300/10',
      inset && 'pl-8',
      className,
    )}
  >
    {children}
    <IconChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));

// ContextMenuSubContent

const ContextMenuSubContent = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    {...props}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded bg-neutral-800 p-1 shadow-lg',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
  />
));

// ContextMenuSeparator

const ContextMenuSeparator = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-neutral-700', className)}
    {...props}
  />
));
// ContextMenuLabel

const ContextMenuLabel = forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold text-neutral-400', inset && 'pl-8', className)}
    {...props}
  />
));

// DropdownShortcut

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
    {...props}
  />
);

// ContextMenu

export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Sub: ContextMenuSub,
  SubTrigger: ContextMenuSubTrigger,
  SubContent: ContextMenuSubContent,
  Separator: ContextMenuSeparator,
  Label: ContextMenuLabel,
  Shortcut: ContextMenuShortcut,
  Group: ContextMenuGroup,
  Portal: ContextMenuPortal,
};
