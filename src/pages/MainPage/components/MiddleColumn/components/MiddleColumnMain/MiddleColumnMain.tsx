import cn from 'classnames';
import { Fragment } from 'react';

import { Observer } from '~/components';
import { ContextMenu } from '~/components/common';
import { IconPapers, IconTrash } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';

import { DateButton, DeleteMessageDialog, MessageItem, ScrollDownButton } from './components';
import { groupMessagesByDate } from './helpers';
import { useMiddleColumnMain } from './hooks';

export const MiddleColumnMain = () => {
  const intl = useIntl();
  const { state, refs, functions } = useMiddleColumnMain();

  return (
    <>
      <div
        ref={refs.chatNodeRef}
        className={cn('grow overflow-auto px-2', 'md:px-0')}
      >
        {!!state.messages.length && (
          <div
            className={cn('mx-auto flex flex-col-reverse break-words', 'md:w-8/12', 'xl:w-6/12')}
          >
            <Observer
              key={Math.random()}
              observerParams={{
                root: refs.chatNodeRef.current,
                rootMargin: '0px 0px 250px 0px',
              }}
              observe={functions.observeLowerBorder}
            />
            {groupMessagesByDate(state.messages).map((dateGroup) => (
              <div
                key={dateGroup.date.valueOf()}
                className="flex flex-col-reverse"
              >
                {dateGroup.messages.map((message) => {
                  const isFirstUnreadMessage = state.firstUnreadMessage?.id === message.id;
                  const needScrollToMessage = state.scrollToMessage?.id === message.id;

                  const onClickCopy = () => navigator.clipboard.writeText(message.message).catch();
                  const onClickDelete = () => functions.setDeleteMessage(message);

                  return (
                    <Fragment key={message.id}>
                      <ContextMenu.Root>
                        <ContextMenu.Trigger
                          className="flex flex-col py-1"
                          onDoubleClick={() => functions.setReplyMessage(message)}
                        >
                          <MessageItem
                            ref={(node) => {
                              if (needScrollToMessage) {
                                refs.scrollToMessageNodeRef.current = node;
                              }
                            }}
                            message={message}
                            onClickReplyMessage={functions.onClickReplyMessage}
                          />
                        </ContextMenu.Trigger>
                        <ContextMenu.Content className="w-56">
                          <ContextMenu.Item onClick={onClickCopy}>
                            {intl.t('page.home.middleColumn.main.contextMenu.item.copy')}
                            <ContextMenu.Shortcut>
                              <IconPapers />
                            </ContextMenu.Shortcut>
                          </ContextMenu.Item>
                          {message.userId === state.user?.id && (
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
                      {isFirstUnreadMessage && (
                        <div className="rounded bg-primary-700/25 text-center text-sm font-medium text-white">
                          {intl.t('page.home.middleColumn.unreadedMessages')}
                        </div>
                      )}
                    </Fragment>
                  );
                })}
                <DateButton date={dateGroup.date} />
              </div>
            ))}
            <Observer
              key={Math.random()}
              observerParams={{
                root: refs.chatNodeRef.current,
                rootMargin: '250px 0px 0px 0px',
              }}
              observe={functions.observeUpperBorder}
            />
          </div>
        )}
      </div>
      <div className="relative">
        <ScrollDownButton
          ref={refs.scrollDownNodeRef}
          color="neutral"
          s="l"
          onClick={functions.onClickScrollDownButton}
        />
      </div>
      <DeleteMessageDialog
        open={state.isDeleteMessageDialogOpen}
        onOpenChange={functions.onDeleteMessageDialogOpenChange}
        onDelete={functions.onDeleteMessage}
      />
    </>
  );
};
