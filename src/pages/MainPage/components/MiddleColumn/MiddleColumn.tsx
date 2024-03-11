import cn from 'classnames';

import { MiddleColumnMain, MiddleColumnHeader, MiddleColumnFooter } from './components';
import { ReplyProvider } from './contexts';

export const MiddleColumn = () => (
  <ReplyProvider>
    <div className={cn('flex grow flex-col overflow-hidden', 'lg:static')}>
      <MiddleColumnHeader />
      <div className="flex w-full grow flex-col overflow-hidden">
        <MiddleColumnMain />
        <MiddleColumnFooter />
      </div>
    </div>
  </ReplyProvider>
);
