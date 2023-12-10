import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import cn from 'classnames';

import { IconCheck, IconChevron } from '~/components/common/icons';

// DropdownMenuRoot

const DropdownMenuRoot = DropdownMenuPrimitive.Root;

// DropdownMenuTrigger

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// DropdownMenuContent

interface DropdownMenuContentProps extends Props<typeof DropdownMenuPrimitive.Content> {}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, ...props }) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      {...props}
      className={cn('rounded bg-neutral-800 p-2 shadow-xl shadow-black/10', props.className)}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
);

// DropdownMenuItem

interface DropdownMenuItemProps extends Props<typeof DropdownMenuPrimitive.Item> {
  endAdornment?: React.ReactNode;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  endAdornment,
  children,
  ...props
}) => (
  <DropdownMenuPrimitive.Item
    {...props}
    className={cn(
      'flex select-none items-center justify-between gap-3 rounded px-2 py-1.5 pl-7 text-sm font-medium text-neutral-50',
      'data-[highlighted]:cursor-pointer data-[highlighted]:bg-neutral-300/10 data-[highlighted]:outline-none',
      'data-[disabled]:text-neutral-500',
      props.className,
    )}
  >
    <div className="grow">{children}</div>
    {endAdornment && <div className="h-[16px] w-[16px] text-neutral-500">{endAdornment}</div>}
  </DropdownMenuPrimitive.Item>
);

// DropdownMenuCheckboxItem

interface DropdownMenuCheckboxItemProps extends Props<typeof DropdownMenuPrimitive.CheckboxItem> {}

const DropdownMenuCheckboxItem: React.FC<DropdownMenuCheckboxItemProps> = ({
  children,
  ...props
}) => (
  <DropdownMenuPrimitive.CheckboxItem
    {...props}
    className={cn(
      'group relative select-none gap-1 rounded px-2 py-1.5 pl-7 text-sm font-medium text-neutral-50',
      'data-[highlighted]:cursor-pointer data-[highlighted]:bg-neutral-300/10 data-[highlighted]:outline-none',
      'data-[disabled]:text-neutral-500',
      props.className,
    )}
  >
    {children}
    <DropdownMenuPrimitive.ItemIndicator
      className={cn('absolute left-1 text-primary-500', 'group-data-[disabled]:text-neutral-500')}
    >
      <IconCheck />
    </DropdownMenuPrimitive.ItemIndicator>
  </DropdownMenuPrimitive.CheckboxItem>
);

// DropdownMenuRadioGroup

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// DropdownMenuRadioItem

interface DropdownMenuRadioItemProps extends Props<typeof DropdownMenuPrimitive.RadioItem> {}

const DropdownMenuRadioItem: React.FC<DropdownMenuRadioItemProps> = ({ children, ...props }) => (
  <DropdownMenuPrimitive.RadioItem
    {...props}
    className={cn(
      'group relative select-none rounded px-2 py-1.5 pl-7 text-sm font-medium text-neutral-50',
      'data-[highlighted]:cursor-pointer data-[highlighted]:bg-neutral-300/10 data-[highlighted]:outline-none',
      'data-[disabled]:text-neutral-500',
      props.className,
    )}
  >
    {children}
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
  </DropdownMenuPrimitive.RadioItem>
);

// DropdownMenuSub

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

// DropdownMenuSubTrigger

interface DropdownMenuSubTriggerProps extends Props<typeof DropdownMenuPrimitive.SubTrigger> {}

const DropdownMenuSubTrigger: React.FC<DropdownMenuSubTriggerProps> = ({ children, ...props }) => (
  <DropdownMenuPrimitive.SubTrigger
    {...props}
    className={cn(
      'flex select-none items-center justify-between gap-3 rounded px-2 py-1.5 pl-7 text-sm font-medium text-neutral-50',
      'data-[highlighted]:cursor-pointer data-[highlighted]:bg-neutral-300/10 data-[highlighted]:outline-none',
      'data-[disabled]:text-neutral-500',
      props.className,
    )}
  >
    <div className="grow">{children}</div>
    <div className="h-[16px] w-[16px] text-neutral-500">
      <IconChevron direction="right" />
    </div>
  </DropdownMenuPrimitive.SubTrigger>
);

// DropdownMenuSubContent

interface DropdownMenuSubContentProps extends Props<typeof DropdownMenuPrimitive.SubContent> {}

const DropdownMenuSubContent: React.FC<DropdownMenuSubContentProps> = ({ children, ...props }) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      {...props}
      className={cn('rounded bg-neutral-800 p-2 shadow-xl shadow-black/10', props.className)}
    >
      {children}
    </DropdownMenuPrimitive.SubContent>
  </DropdownMenuPrimitive.Portal>
);

// DropdownMenuSeparator

interface DropdownMenuSeparatorProps
  extends Omit<Props<typeof DropdownMenuPrimitive.Separator>, 'children'> {}

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ ...props }) => (
  <DropdownMenuPrimitive.Separator className={cn('m-1 h-[1px] bg-neutral-700', props.className)} />
);

// DropdownMenuLabel

interface DropdownMenuLabelProps extends Props<typeof DropdownMenuPrimitive.Label> {}

const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({ children, ...props }) => (
  <DropdownMenuPrimitive.Label
    className={cn('pl-6 text-sm leading-6 text-neutral-500', props.className)}
  >
    {children}
  </DropdownMenuPrimitive.Label>
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
};
