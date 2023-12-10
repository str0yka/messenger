import * as TabsPrimitive from '@radix-ui/react-tabs';
import cn from 'classnames';

// TabsRoot

interface TabsRootProps extends Props<typeof TabsPrimitive.Root> {
  children: React.ReactNode;
}

const TabsRoot: React.FC<TabsRootProps> = ({ children, ...props }) => (
  <TabsPrimitive.Root
    {...props}
    className={cn('flex w-[350px] flex-col', props.className)}
  >
    {children}
  </TabsPrimitive.Root>
);

// TabsList

interface TabsListProps extends Props<typeof TabsPrimitive.List> {
  children: React.ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ children, ...props }) => (
  <TabsPrimitive.List
    {...props}
    className={cn('flex border-b border-neutral-700', props.className)}
  >
    {children}
  </TabsPrimitive.List>
);

// TabsTrigger

interface TabsTriggerProps extends Props<typeof TabsPrimitive.Trigger> {
  children: React.ReactNode;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, ...props }) => (
  <TabsPrimitive.Trigger
    {...props}
    className={cn(
      'h-12 flex-1 bg-neutral-800 font-medium text-neutral-50 first:rounded-tl last:rounded-tr',
      'data-[state=active]:border-b data-[state=active]:text-primary-400 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]',
      props.className,
    )}
  >
    {children}
  </TabsPrimitive.Trigger>
);

const TabsContent = TabsPrimitive.Content;

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};
