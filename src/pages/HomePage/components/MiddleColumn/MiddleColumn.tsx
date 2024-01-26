import cn from 'classnames';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { IconButton, CircularProgress, Avatar } from '~/components/common';
import { IconCross } from '~/components/common/icons';
import { PRIVATE_ROUTE } from '~/utils/constants';

import { useSocket } from '../../contexts';

import { Chat } from './components';

export const MiddleColumn = () => {
  const { id: partnerId } = useParams();

  const socket = useSocket();

  const [dialog, setDialog] = useState<Parameters<ServerToClientEvents['dialog:put']>['0'] | null>(
    null,
  );

  useEffect(() => {
    const onDialogUpdateRequired: ServerToClientEvents['dialog:updateRequired'] = () => {
      console.log('dialog:updateRequired');
      socket.emit('dialog:getOrCreate', Number(partnerId));
    };

    const onDialogPut: ServerToClientEvents['dialog:put'] = (d) => {
      console.log('dialog:put', d);
      setDialog(d);
    };

    socket.on('dialog:updateRequired', onDialogUpdateRequired);
    socket.on('dialog:put', onDialogPut);

    socket.emit('dialog:getOrCreate', Number(partnerId));

    return () => {
      socket.off('dialog:updateRequired', onDialogUpdateRequired);
      socket.off('dialog:put', onDialogPut);
    };
  }, [partnerId]);

  if (!dialog) {
    return (
      <div className="flex grow items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={cn('flex grow flex-col overflow-hidden', 'lg:static')}>
      <div className="flex cursor-pointer items-center gap-4 border-b border-b-neutral-700 bg-neutral-800 px-4 py-2">
        <div>
          <Link to={PRIVATE_ROUTE.HOME}>
            <IconButton>
              <IconCross />
            </IconButton>
          </Link>
        </div>
        <Avatar fallback={dialog.partner.email[0]} />
        <h2 className="truncate font-semibold text-neutral-50">{dialog.partner.email}</h2>
      </div>
      <Chat
        dialogId={dialog.id}
        chatId={dialog.chatId}
        unreadedMessagesCount={dialog.unreadedMessagesCount}
      />
    </div>
  );
};
