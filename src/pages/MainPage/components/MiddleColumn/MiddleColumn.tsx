import cn from 'classnames';
import { useParams } from 'react-router-dom';

import { MiddleColumnMain, MiddleColumnHeader, MiddleColumnFooter } from './components';
import { OutgoingMessagesProvider, ReplyProvider } from './contexts';

export const MiddleColumn = () => {
  const { id } = useParams();

  return (
    <ReplyProvider key={id}>
      {/* $FIXME */}
      <OutgoingMessagesProvider>
        <div className={cn('flex grow flex-col overflow-hidden', 'lg:static')}>
          <MiddleColumnHeader />
          <div className="flex w-full grow flex-col overflow-hidden">
            <MiddleColumnMain />
            <MiddleColumnFooter />
          </div>
        </div>
      </OutgoingMessagesProvider>
    </ReplyProvider>
  );
};
