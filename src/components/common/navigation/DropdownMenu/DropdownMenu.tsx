import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import cn from 'classnames';
import { forwardRef } from 'react';

import { IconCheck, IconChevronRight } from '~/components/common/icons';

// DropdownMenuRoot

const DropdownMenuRoot = DropdownMenuPrimitive.Root;

// DropdownMenuTrigger

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// DropdownMenuGroup

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// DropdownMenuPortal

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

// DropdownMenuSub

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

// DropdownMenuRadioGroup

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// DropdownMenuContent

const DropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      {...props}
      ref={ref}
      sideOffset={sideOffset}
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
  </DropdownMenuPrimitive.Portal>
));

// DropdownMenuItem

const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
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

// DropdownMenuCheckboxItem

const DropdownMenuCheckboxItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, checked, children, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    {...props}
    ref={ref}
    checked={checked}
    className={cn(
      'relative flex cursor-pointer select-none rounded py-1.5 pl-8 pr-2 text-sm font-medium text-neutral-50 outline-none transition-colors',
      'focus:bg-neutral-300/10',
      'data-[disabled]:pointer-events-none data-[disabled]:text-neutral-500',
      className,
    )}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <IconCheck className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));

// DropdownMenuRadioItem

const DropdownMenuRadioItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
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
      <DropdownMenuPrimitive.ItemIndicator
        className={cn(
          'absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary-400',
          'group-data-[disabled]:bg-neutral-600',
        )}
      />
    </div>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

// DropdownMenuSubTrigger

const DropdownMenuSubTrigger = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
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
  </DropdownMenuPrimitive.SubTrigger>
));

// DropdownMenuSubContent

const DropdownMenuSubContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
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

// DropdownMenuSeparator

const DropdownMenuSeparator = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-neutral-700', className)}
    {...props}
  />
));
// DropdownMenuLabel

const DropdownMenuLabel = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold text-neutral-400', inset && 'pl-8', className)}
    {...props}
  />
));

// DropdownShortcut

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
    {...props}
  />
);

// DropdownMenu

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
  Shortcut: DropdownMenuShortcut,
  Group: DropdownMenuGroup,
  Portal: DropdownMenuPortal,
};
