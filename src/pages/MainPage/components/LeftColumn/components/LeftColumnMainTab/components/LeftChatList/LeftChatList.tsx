import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { PRIVATE_ROUTE } from '~/utils/constants';
import { getUserLink, getUserName } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { useDialog, useSocket } from '../../../../../../contexts';
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
    <AnimatePresence mode="wait">
      <ul className="flex grow flex-col overflow-auto p-2">
        {dialogs.map((dialog, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 * index }}
          >
            <Link to={PRIVATE_ROUTE.USER(getUserLink(dialog.dialog.partner))}>
              <ChatItem
                title={getUserName(dialog.dialog.partner)}
                avatarFallback={getUserName(dialog.dialog.partner)[0]}
                lastMessage={dialog.lastMessage}
                lastMessageSentByUser={dialog.lastMessage?.userId === user?.id}
                unreadedMessagesCount={dialog.unreadedMessagesCount}
                active={activeDialog?.id === dialog.dialog.id}
                status={dialog.dialog.partner.status}
              />
            </Link>
          </motion.li>
        ))}
      </ul>
    </AnimatePresence>
  );
};
