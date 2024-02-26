import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { PRIVATE_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

import { useDialog, useSocket } from '../../../../contexts';
import { ChatItem } from '../ChatItem/ChatItem';

export const LeftChatList = () => {
  const user = useUserStore((state) => state.user);
  const socket = useSocket();
  const activeDialog = useDialog();

  const [dialogs, setDialogs] = useState<
    Parameters<ServerToClientEvents['SERVER:DIALOGS_PUT']>['0']['dialogs']
  >([]);

  useEffect(() => {
    const onDialogsPut: ServerToClientEvents['SERVER:DIALOGS_PUT'] = ({ dialogs: dialogsData }) => {
      console.log('[SERVER:DIALOGS_PUT]: ', dialogsData);
      setDialogs(dialogsData);
    };

    const onDialogsNeedToUpdate: ServerToClientEvents['SERVER:DIALOGS_NEED_TO_UPDATE'] = () => {
      console.log('[SERVER:DIALOGS_NEED_TO_UPDATE]');
      socket.emit('CLIENT:DIALOGS_GET');
    };

    socket.on('SERVER:DIALOGS_PUT', onDialogsPut);
    socket.on('SERVER:DIALOGS_NEED_TO_UPDATE', onDialogsNeedToUpdate);

    socket.emit('CLIENT:DIALOGS_GET');

    return () => {
      socket.off('SERVER:DIALOGS_PUT', onDialogsPut);
      socket.off('SERVER:DIALOGS_NEED_TO_UPDATE', onDialogsNeedToUpdate);
    };
  }, []);

  return (
    <ul className="flex grow flex-col overflow-auto p-2">
      {dialogs.map((dialog, index) => (
        <li key={index}>
          <Link to={PRIVATE_ROUTE.USER(dialog.dialog.partnerId)}>
            <ChatItem
              title={dialog.dialog.partner.email}
              avatarFallback={dialog.dialog.partner.email[0]}
              lastMessage={dialog.lastMessage}
              lastMessageSentByUser={dialog.lastMessage?.userId === user?.id}
              unreadedMessagesCount={dialog.unreadedMessagesCount}
              active={activeDialog?.id === dialog.dialog.id}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};
