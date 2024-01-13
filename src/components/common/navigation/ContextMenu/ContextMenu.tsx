import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import cn from 'classnames';

import { IconCheck, IconChevron } from '~/components/common/icons';

// ContextMenuRoot

const ContextMenuRoot = ContextMenuPrimitive.Root;

// ContextMenuTrigger

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

// ContextMenuContent

interface ContextMenuContentProps extends Props<typeof ContextMenuPrimitive.Content> {}

const ContextMenuContent: React.FC<ContextMenuContentProps> = ({ children, ...props }) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      {...props}
      className={cn('rounded bg-neutral-800 p-2 shadow-xl shadow-black/10', props.className)}
    >
      {children}
    </ContextMenuPrimitive.Content>
  </ContextMenuPrimitive.Portal>
);

// ContextMenuItem

interface ContextMenuItemProps extends Props<typeof ContextMenuPrimitive.Item> {
  endAdornment?: React.ReactNode;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ endAdornment, children, ...props }) => (
  <ContextMenuPrimitive.Item
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
  </ContextMenuPrimitive.Item>
);

// ContextMenuCheckboxItem

interface ContextMenuCheckboxItemProps extends Props<typeof ContextMenuPrimitive.CheckboxItem> {}

const ContextMenuCheckboxItem: React.FC<ContextMenuCheckboxItemProps> = ({
  children,
  ...props
}) => (
  <ContextMenuPrimitive.CheckboxItem
    {...props}
    className={cn(
      'group relative select-none gap-1 rounded px-2 py-1.5 pl-7 text-sm font-medium text-neutral-50',
      'data-[highlighted]:cursor-pointer data-[highlighted]:bg-neutral-300/10 data-[highlighted]:outline-none',
      'data-[disabled]:text-neutral-500',
      props.className,
    )}
  >
    {children}
    <ContextMenuPrimitive.ItemIndicator
      className={cn('absolute left-1 text-primary-500', 'group-data-[disabled]:text-neutral-500')}
    >
      <IconCheck />
    </ContextMenuPrimitive.ItemIndicator>
  </ContextMenuPrimitive.CheckboxItem>
);

// ContextMenuRadioGroup

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

// ContextMenuRadioItem

interface ContextMenuRadioItemProps extends Props<typeof ContextMenuPrimitive.RadioItem> {}

const ContextMenuRadioItem: React.FC<ContextMenuRadioItemProps> = ({ children, ...props }) => (
  <ContextMenuPrimitive.RadioItem
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
      <ContextMenuPrimitive.ItemIndicator
        className={cn(
          'absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary-400',
          'group-data-[disabled]:bg-neutral-600',
        )}
      />
    </div>
  </ContextMenuPrimitive.RadioItem>
);

// ContextMenuSub

const ContextMenuSub = ContextMenuPrimitive.Sub;

// ContextMenuSubTrigger

interface ContextMenuSubTriggerProps extends Props<typeof ContextMenuPrimitive.SubTrigger> {}

const ContextMenuSubTrigger: React.FC<ContextMenuSubTriggerProps> = ({ children, ...props }) => (
  <ContextMenuPrimitive.SubTrigger
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
  </ContextMenuPrimitive.SubTrigger>
);

// ContextMenuSubContent

interface ContextMenuSubContentProps extends Props<typeof ContextMenuPrimitive.SubContent> {}

const ContextMenuSubContent: React.FC<ContextMenuSubContentProps> = ({ children, ...props }) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.SubContent
      {...props}
      className={cn('rounded bg-neutral-800 p-2 shadow-xl shadow-black/10', props.className)}
    >
      {children}
    </ContextMenuPrimitive.SubContent>
  </ContextMenuPrimitive.Portal>
);

// ContextMenuSeparator

interface ContextMenuSeparatorProps
  extends Omit<Props<typeof ContextMenuPrimitive.Separator>, 'children'> {}

const ContextMenuSeparator: React.FC<ContextMenuSeparatorProps> = ({ ...props }) => (
  <ContextMenuPrimitive.Separator className={cn('m-1 h-[1px] bg-neutral-700', props.className)} />
);

// ContextMenuLabel

interface ContextMenuLabelProps extends Props<typeof ContextMenuPrimitive.Label> {}

const ContextMenuLabel: React.FC<ContextMenuLabelProps> = ({ children, ...props }) => (
  <ContextMenuPrimitive.Label
    className={cn('pl-6 text-sm leading-6 text-neutral-500', props.className)}
  >
    {children}
  </ContextMenuPrimitive.Label>
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
};
