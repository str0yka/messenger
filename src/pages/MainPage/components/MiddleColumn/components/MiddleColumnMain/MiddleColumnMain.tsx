import cn from 'classnames';
import { Fragment } from 'react';

import { Intl, Observer } from '~/components';
import { ContextMenu, IconButton } from '~/components/common';
import {
  IconCross,
  IconPapers,
  IconPushPin,
  IconPushPinSlashed,
  IconReply,
  IconTrash,
} from '~/components/common/icons';

import {
  DateButton,
  DeleteMessageDialog,
  ForwardMessageDialog,
  MessageItem,
  ScrollDownButton,
} from './components';
import { groupMessagesByDate } from './helpers';
import { useMiddleColumnMain } from './hooks';

export const MiddleColumnMain = () => {
  const { state, refs, functions } = useMiddleColumnMain();

  return (
    <>
      {state.pinnedMessage && (
        <div
          className="flex shrink-0 cursor-pointer gap-2 bg-neutral-800 px-4 py-2"
          role="button"
          aria-hidden
          tabIndex={0}
          onClick={functions.onClickPinnedMessage}
        >
          <div className="w-0.5 bg-primary-400" />
          <div className="flex grow flex-col truncate text-sm">
            <span className="leading-5 text-primary-400">
              <Intl path="page.home.middleColumn.main.pinnedMessage" />
            </span>
            <span className="truncate">{state.pinnedMessage.message.text}</span>
          </div>
          <div>
            <IconButton onClick={functions.onClickUnpinMessage}>
              <IconCross />
            </IconButton>
          </div>
        </div>
      )}
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
                  const isPinnedMessage = state.pinnedMessage?.id === message.id;
                  const isFirstUnreadMessage = state.firstUnreadMessage?.id === message.id;
                  const needScrollToMessage = state.scrollToMessage?.id === message.id;

                  const onClickReply = () => functions.setReplyMessage(message);
                  const onClickCopy = () =>
                    navigator.clipboard.writeText(message.message.text).catch();
                  const onClickDelete = () => functions.setDeleteMessage(message);
                  const onClickForward = () => functions.setForwardMessage(message);

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
                            isPinned={isPinnedMessage}
                            onClickReplyMessage={functions.onClickReplyMessage}
                          />
                        </ContextMenu.Trigger>
                        <ContextMenu.Content className="w-56">
                          <ContextMenu.Item onClick={onClickReply}>
                            <Intl path="page.home.middleColumn.main.contextMenu.item.reply" />
                            <ContextMenu.Shortcut>
                              <IconReply />
                            </ContextMenu.Shortcut>
                          </ContextMenu.Item>
                          <ContextMenu.Item onClick={onClickCopy}>
                            <Intl path="page.home.middleColumn.main.contextMenu.item.copy" />
                            <ContextMenu.Shortcut>
                              <IconPapers />
                            </ContextMenu.Shortcut>
                          </ContextMenu.Item>
                          {!isPinnedMessage && (
                            <ContextMenu.Item onClick={functions.onClickPinMessage(message)}>
                              <Intl path="page.home.middleColumn.main.contextMenu.item.pin" />
                              <ContextMenu.Shortcut>
                                <IconPushPin />
                              </ContextMenu.Shortcut>
                            </ContextMenu.Item>
                          )}
                          {isPinnedMessage && (
                            <ContextMenu.Item onClick={functions.onClickUnpinMessage}>
                              <Intl path="page.home.middleColumn.main.contextMenu.item.unpin" />
                              <ContextMenu.Shortcut>
                                <IconPushPinSlashed />
                              </ContextMenu.Shortcut>
                            </ContextMenu.Item>
                          )}
                          <ContextMenu.Item onClick={onClickForward}>
                            <Intl path="page.home.middleColumn.main.contextMenu.item.forward" />
                            <ContextMenu.Shortcut>
                              <IconReply className="-scale-x-100" />
                            </ContextMenu.Shortcut>
                          </ContextMenu.Item>
                          {message.userId === state.user?.id && (
                            <ContextMenu.Item
                              onClick={onClickDelete}
                              className="text-red-400"
                            >
                              <Intl path="page.home.middleColumn.main.contextMenu.item.deleteMessage" />
                              <ContextMenu.Shortcut>
                                <IconTrash />
                              </ContextMenu.Shortcut>
                            </ContextMenu.Item>
                          )}
                        </ContextMenu.Content>
                      </ContextMenu.Root>
                      {isFirstUnreadMessage && (
                        <div className="rounded bg-primary-700/25 text-center text-sm font-medium text-white">
                          <Intl path="page.home.middleColumn.unreadedMessages" />
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
      <ForwardMessageDialog
        open={state.isForwardMessageDialogOpen}
        onOpenChange={functions.onForwardMessageDialogOpenChange}
        onForward={functions.onForwardMessage}
      />
      <DeleteMessageDialog
        open={state.isDeleteMessageDialogOpen}
        onOpenChange={functions.onDeleteMessageDialogOpenChange}
        onDelete={functions.onDeleteMessage}
      />
    </>
  );
};
