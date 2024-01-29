import cn from 'classnames';

import { MiddleColumnMain, MiddleColumnHeader, MiddleColumnFooter } from './components';

export const MiddleColumn = () => (
  <div className={cn('flex grow flex-col overflow-hidden', 'lg:static')}>
    <MiddleColumnHeader />
    <div className="flex w-full grow flex-col overflow-hidden">
      <MiddleColumnMain />
      <MiddleColumnFooter />
    </div>
  </div>
);
