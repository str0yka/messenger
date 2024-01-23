import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { PRIVATE_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../contexts';
import { ChatItem } from '../ChatItem/ChatItem';

export const LeftChatList = () => {
  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const [dialogs, setDialogs] = useState<Parameters<ServerToClientEvents['dialogs:put']>['0']>([]);

  useEffect(() => {
    const onDialogsPut: ServerToClientEvents['dialogs:put'] = (ds) => {
      console.log('dialogs:put', ds);
      setDialogs(ds);
    };

    const onDialogsUpdateRequired: ServerToClientEvents['dialogs:updateRequired'] = () => {
      console.log('dialogs:updateRequired');
      socket.emit('dialogs:get');
    };

    socket.on('dialogs:put', onDialogsPut);
    socket.on('dialogs:updateRequired', onDialogsUpdateRequired);

    socket.emit('dialogs:get');

    return () => {
      socket.off('dialogs:put', onDialogsPut);
      socket.off('dialogs:updateRequired', onDialogsUpdateRequired);
    };
  }, []);

  return (
    <ul className="flex grow flex-col overflow-auto p-2">
      {dialogs.map((d, index) => (
        <li key={index}>
          <Link to={PRIVATE_ROUTE.USER(d.partnerId)}>
            <ChatItem
              title={d.partner.email}
              avatarFallback={d.partner.email[0]}
              lastMessage={d.lastMessage}
              lastMessageSentByUser={d.lastMessage?.userId === user?.id}
              unreadedMessagesCount={d.unreadedMessagesCount}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};
