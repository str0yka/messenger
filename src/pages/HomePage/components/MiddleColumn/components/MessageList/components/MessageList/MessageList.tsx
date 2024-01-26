import React from 'react';

import { Button, Calendar, ContextMenu, Dialog } from '~/components/common';
import { IconPapers, IconTrash } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { createDate, isDateEqual } from '~/utils/helpers';

import { MessageItem } from '../MessageItem/MessageItem';
import { MessageItemWithObserver } from '../MessageItemWithObserver/MessageItemWithObserver';

interface MessageListProps {
  userId: number;
  messages: Message[];
  setDeleteMessage: (message: Message) => void;
  onRead: (message: Message) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  userId,
  messages,
  setDeleteMessage,
  onRead,
}) => {
  const intl = useIntl();

  return messages.map((message, index) => {
    const isLastInArray = index === messages.length - 1;
    const isMessageSendByUser = userId === message.userId;
    const messageDate = new Date(message.createdAt);
    const nextMessageDate = new Date(messages[index + 1]?.createdAt);
    const needToDisplayDate = isLastInArray || !isDateEqual(messageDate, nextMessageDate);
    const { dayNumber, month } = createDate({
      date: messageDate,
      locale: intl.locale,
    });

    let MessageComponent;
    if (!message.read && !isMessageSendByUser) {
      MessageComponent = (
        <MessageItemWithObserver
          message={message}
          sentByUser={isMessageSendByUser}
          observe={(entry) => {
            if (entry?.isIntersecting) {
              onRead(message);
            }
          }}
        />
      );
    } else {
      MessageComponent = (
        <MessageItem
          message={message}
          sentByUser={isMessageSendByUser}
        />
      );
    }

    const onClickCopy = () => navigator.clipboard.writeText(message.message).catch();

    const onClickDelete = () => setDeleteMessage(message);

    return (
      <React.Fragment key={message.id}>
        <ContextMenu.Root>
          <ContextMenu.Trigger className="flex flex-col">{MessageComponent}</ContextMenu.Trigger>
          <ContextMenu.Content className="w-56">
            <ContextMenu.Item onClick={onClickCopy}>
              {intl.t('page.home.middleColumn.main.contextMenu.item.copy')}
              <ContextMenu.Shortcut>
                <IconPapers />
              </ContextMenu.Shortcut>
            </ContextMenu.Item>
            {message.userId === userId && (
              <ContextMenu.Item
                onClick={onClickDelete}
                className="text-red-400"
              >
                {intl.t('page.home.middleColumn.main.contextMenu.item.deleteMessage')}
                <ContextMenu.Shortcut>
                  <IconTrash />
                </ContextMenu.Shortcut>
              </ContextMenu.Item>
            )}
          </ContextMenu.Content>
        </ContextMenu.Root>
        {needToDisplayDate && (
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                className="select-none self-center rounded-3xl bg-neutral-950/40 px-2 py-1 text-sm font-medium text-neutral-50"
                type="button"
              >
                {dayNumber} {month}
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay />
              <Dialog.Content className="rounded-xl bg-neutral-800 p-4">
                <Dialog.Title>Sat, January 13</Dialog.Title>
                <Calendar className="mb-4 mt-4" />
                <div className="flex items-center justify-between gap-4">
                  <Button>TO DATE</Button>
                  <Dialog.Close asChild>
                    <Button>CANCEL</Button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </React.Fragment>
    );
  });
};
