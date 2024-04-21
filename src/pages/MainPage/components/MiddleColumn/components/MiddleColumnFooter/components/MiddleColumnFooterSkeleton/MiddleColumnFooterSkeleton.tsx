import cn from 'classnames';

export const MiddleColumnFooterSkeleton = () => (
  <div
    className={cn(
      'mx-auto flex w-full animate-pulse gap-2 px-2 pb-4 pt-1',
      'md:w-8/12 md:px-0',
      'xl:w-6/12',
    )}
  >
    <div className="h-12 w-full rounded-2xl bg-neutral-800" />
    <div className="h-12 w-12 shrink-0 rounded-full bg-neutral-800" />
  </div>
);
