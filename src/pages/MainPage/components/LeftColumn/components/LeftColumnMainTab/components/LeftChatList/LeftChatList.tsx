import { AnimatePresence, Reorder, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { ContextMenu } from '~/components/common';
import { IconPushPin, IconPushPinSlashed } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { PRIVATE_ROUTE } from '~/utils/constants';
import { getUserLink, getUserName } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { useDialog, useSocket } from '../../../../../../contexts';
import { ChatItem } from '../ChatItem/ChatItem';
import { SavedMessagesChatItem } from '../SavedMessagesChatItem/SavedMessagesChatItem';

export const LeftChatList = () => {
  const user = useUserStore((state) => state.user);
  const intl = useIntl();

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
        <Reorder.Group
          axis="y"
          onReorder={(pinnedDialogs) => {
            setDialogs((prevDialogs) => ({ ...prevDialogs, pinned: pinnedDialogs }));
            socket.emit('CLIENT:DIALOG_CHANGE_PINNED_ORDER', {
              dialogs: pinnedDialogs.map((dialog, index) => ({
                dialogId: dialog.id,
                order: index + 1,
              })),
            });
          }}
          values={dialogs.pinned}
        >
          {dialogs.pinned.map((dialog) => (
            <Reorder.Item
              key={dialog.id}
              value={dialog}
              style={{ position: 'relative' }}
            >
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Link
                    to={PRIVATE_ROUTE.USER(getUserLink(dialog.partner))}
                    className="drag-none"
                  >
                    {dialog.userId === dialog.partnerId && (
                      <SavedMessagesChatItem
                        lastMessage={dialog.lastMessage}
                        active={activeDialog?.id === dialog.id}
                        isPinned={dialog.isPinned}
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
                        isPinned={dialog.isPinned}
                      />
                    )}
                  </Link>
                </ContextMenu.Trigger>
                <ContextMenu.Content className="w-56">
                  <ContextMenu.Item
                    onClick={() => socket.emit('CLIENT:DIALOG_UNPIN', { dialogId: dialog.id })}
                  >
                    {intl.t('page.home.leftColumn.chatList.chatItem.contextMenu.unpin')}
                    <ContextMenu.Shortcut>
                      <IconPushPinSlashed />
                    </ContextMenu.Shortcut>
                  </ContextMenu.Item>
                </ContextMenu.Content>
              </ContextMenu.Root>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        {dialogs.unpinned.map((dialog, index) => (
          <ContextMenu.Root key={index}>
            <ContextMenu.Trigger>
              <motion.li
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
            </ContextMenu.Trigger>
            <ContextMenu.Content className="w-56">
              <ContextMenu.Item
                onClick={() => socket.emit('CLIENT:DIALOG_PIN', { dialogId: dialog.id })}
              >
                {intl.t('page.home.leftColumn.chatList.chatItem.contextMenu.pin')}
                <ContextMenu.Shortcut>
                  <IconPushPin />
                </ContextMenu.Shortcut>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        ))}
      </ul>
    </AnimatePresence>
  );
};
