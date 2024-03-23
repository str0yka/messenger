export const ChatItemSkeleton = () => (
  <div className="flex animate-pulse select-none gap-2 rounded-lg p-2">
    <div className="h-14 w-14 rounded-full bg-neutral-700" />
    <div className="flex min-w-[0] grow flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="h-4 grow rounded-full bg-neutral-700" />
        <p className="h-4 w-12 shrink-0 rounded-full bg-neutral-700" />
      </div>
      <p className="h-4 rounded-full bg-neutral-700" />
    </div>
  </div>
);
