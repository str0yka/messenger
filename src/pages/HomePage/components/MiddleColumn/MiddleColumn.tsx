import cn from 'classnames';

import { CircularProgress } from '~/components/common';
import { useChatStore } from '~/utils/store';

import { MiddleColumnMain, MiddleColumnHeader } from './components';

export const MiddleColumn = () => {
  const dialog = useChatStore((state) => state.dialog);

  if (!dialog) {
    return (
      <div className="flex grow items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={cn('flex grow flex-col overflow-hidden', 'lg:static')}>
      <MiddleColumnHeader />
      <div className="flex w-full grow flex-col overflow-hidden">
        <MiddleColumnMain />
      </div>
    </div>
  );
};
