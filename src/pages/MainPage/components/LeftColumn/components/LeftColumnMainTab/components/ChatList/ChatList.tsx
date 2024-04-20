import { AnimatePresence, Reorder, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Intl } from '~/components';
import { ContextMenu } from '~/components/common';
import { IconPushPin, IconPushPinSlashed, IconTrash } from '~/components/common/icons';
import { PRIVATE_ROUTE } from '~/utils/constants';
import { getUserLink, getUserName } from '~/utils/helpers';

import { ChatItem } from '../ChatItem/ChatItem';

import { DeleteDialogDialog } from './components';
import { useChatList } from './hooks';

export const ChatList = () => {
  const { state, functions } = useChatList();

  return (
    <>
      <AnimatePresence mode="wait">
        <ul className="flex grow flex-col overflow-auto p-2">
          <Reorder.Group
            axis="y"
            onReorder={functions.onReorderDialogs}
            values={state.dialogs.pinned}
          >
            {state.dialogs.pinned.map((dialog) => (
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
                      <ChatItem
                        title={getUserName(dialog.partner)}
                        avatarFallback={getUserName(dialog.partner)[0]}
                        lastMessage={dialog.lastMessage}
                        lastMessageSentByUser={dialog.lastMessage?.userId === state.user?.id}
                        unreadedMessagesCount={dialog.unreadedMessagesCount}
                        active={state.activeDialog?.id === dialog.id}
                        status={dialog.partner.status}
                        pinned={dialog.isPinned}
                        savedMessages={dialog.userId === dialog.partnerId}
                        avatar={dialog.partner.avatar}
                      />
                    </Link>
                  </ContextMenu.Trigger>
                  <ContextMenu.Content className="w-56">
                    <ContextMenu.Item onClick={functions.onClickUnpinDialog(dialog.id)}>
                      <Intl path="page.home.leftColumn.chatList.chatItem.contextMenu.unpin" />
                      <ContextMenu.Shortcut>
                        <IconPushPinSlashed />
                      </ContextMenu.Shortcut>
                    </ContextMenu.Item>
                    {dialog.userId !== dialog.partnerId && (
                      <ContextMenu.Item
                        className="text-red-400"
                        onClick={functions.onClickDeleteDialog(dialog)}
                      >
                        <Intl path="page.home.leftColumn.chatList.chatItem.contextMenu.delete" />
                        <ContextMenu.Shortcut>
                          <IconTrash />
                        </ContextMenu.Shortcut>
                      </ContextMenu.Item>
                    )}
                  </ContextMenu.Content>
                </ContextMenu.Root>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          {state.dialogs.unpinned.map((dialog, index) => (
            <ContextMenu.Root key={index}>
              <ContextMenu.Trigger>
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 * index }}
                >
                  <Link to={PRIVATE_ROUTE.USER(getUserLink(dialog.partner))}>
                    <ChatItem
                      title={getUserName(dialog.partner)}
                      avatarFallback={getUserName(dialog.partner)[0]}
                      lastMessage={dialog.lastMessage}
                      lastMessageSentByUser={dialog.lastMessage?.userId === state.user?.id}
                      unreadedMessagesCount={dialog.unreadedMessagesCount}
                      active={state.activeDialog?.id === dialog.id}
                      status={dialog.partner.status}
                      savedMessages={dialog.userId === dialog.partnerId}
                      avatar={dialog.partner.avatar}
                    />
                  </Link>
                </motion.li>
              </ContextMenu.Trigger>
              <ContextMenu.Content className="w-56">
                <ContextMenu.Item onClick={functions.onClickPinDialog(dialog.id)}>
                  <Intl path="page.home.leftColumn.chatList.chatItem.contextMenu.pin" />
                  <ContextMenu.Shortcut>
                    <IconPushPin />
                  </ContextMenu.Shortcut>
                </ContextMenu.Item>
                {dialog.userId !== dialog.partnerId && (
                  <ContextMenu.Item
                    className="text-red-400"
                    onClick={functions.onClickDeleteDialog(dialog)}
                  >
                    <Intl path="page.home.leftColumn.chatList.chatItem.contextMenu.delete" />
                    <ContextMenu.Shortcut>
                      <IconTrash />
                    </ContextMenu.Shortcut>
                  </ContextMenu.Item>
                )}
              </ContextMenu.Content>
            </ContextMenu.Root>
          ))}
        </ul>
      </AnimatePresence>
      <DeleteDialogDialog
        open={state.isDeleteDialogDialogOpen}
        onOpenChange={functions.onDeleteDialogDialogOpenChange}
        onDelete={functions.onDeleteDialog}
      />
    </>
  );
};
