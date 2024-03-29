import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { PRIVATE_ROUTE } from '~/utils/constants';
import { getUserLink, getUserName } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { useDialog, useSocket } from '../../../../../../contexts';
import { ChatItem } from '../ChatItem/ChatItem';
import { SavedMessagesChatItem } from '../SavedMessagesChatItem/SavedMessagesChatItem';

export const LeftChatList = () => {
  const user = useUserStore((state) => state.user);
  const socket = useSocket();
  const activeDialog = useDialog();

  const [dialogs, setDialogs] = useState<
    Parameters<ServerToClientEvents['SERVER:DIALOGS_PUT']>['0']['dialogs']
  >({ pinned: [], unpinned: [] });

  useEffect(() => {
    socket.emit('CLIENT:DIALOGS_GET');

    const onDialogsPut: ServerToClientEvents['SERVER:DIALOGS_PUT'] = (data) => {
      console.log('[LeftChatList:SERVER:DIALOGS_PUT]: ', data);
      setDialogs(data.dialogs);
    };

    socket.on('SERVER:DIALOGS_PUT', onDialogsPut);

    return () => {
      socket.off('SERVER:DIALOGS_PUT', onDialogsPut);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <ul className="flex grow flex-col overflow-auto p-2">
        {dialogs.pinned.map((dialog, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 * index }}
          >
            <Link to={PRIVATE_ROUTE.USER(getUserLink(dialog.partner))}>
              {dialog.userId === dialog.partnerId && (
                <SavedMessagesChatItem
                  lastMessage={dialog.lastMessage}
                  active={activeDialog?.id === dialog.id}
                />
              )}
              {dialog.userId !== dialog.partnerId && (
                <ChatItem
                  title={getUserName(dialog.partner)}
                  avatarFallback={getUserName(dialog.partner)[0]}
                  lastMessage={dialog.lastMessage}
                  lastMessageSentByUser={dialog.lastMessage?.userId === user?.id}
                  unreadedMessagesCount={dialog.unreadedMessagesCount}
                  active={activeDialog?.id === dialog.id}
                  status={dialog.partner.status}
                />
              )}
            </Link>
          </motion.li>
        ))}
        {dialogs.unpinned.map((dialog, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 * index }}
          >
            <Link to={PRIVATE_ROUTE.USER(getUserLink(dialog.partner))}>
              {dialog.userId === dialog.partnerId && (
                <SavedMessagesChatItem
                  lastMessage={dialog.lastMessage}
                  active={activeDialog?.id === dialog.id}
                />
              )}
              {dialog.userId !== dialog.partnerId && (
                <ChatItem
                  title={getUserName(dialog.partner)}
                  avatarFallback={getUserName(dialog.partner)[0]}
                  lastMessage={dialog.lastMessage}
                  lastMessageSentByUser={dialog.lastMessage?.userId === user?.id}
                  unreadedMessagesCount={dialog.unreadedMessagesCount}
                  active={activeDialog?.id === dialog.id}
                  status={dialog.partner.status}
                />
              )}
            </Link>
          </motion.li>
        ))}
      </ul>
    </AnimatePresence>
  );
};
