import cn from 'classnames';
import { Fragment } from 'react';

import { Observer } from '~/components';
import { CircularProgress } from '~/components/common';

import {
  DateButton,
  DeleteMessageDialog,
  MessageContextMenu,
  MessageItem,
  ScrollDownButton,
} from './components';
import { groupMessagesByDate } from './helpers';
import { useMiddleColumnMain } from './hooks';

export const MiddleColumnMain = () => {
  const { state, refs, functions } = useMiddleColumnMain();

  return (
    <>
      <div
        ref={refs.chatNodeRef}
        className={cn('grow overflow-auto px-2', 'md:px-0')}
      >
        {!!state.messages.length && (
          <div
            className={cn(
              'mx-auto my-2 flex flex-col-reverse gap-2 break-words',
              'md:w-8/12',
              'xl:w-6/12',
            )}
          >
            <Observer
              key={Math.random()}
              observerParams={{
                root: refs.chatNodeRef.current,
                rootMargin: '0px 0px 250px 0px',
              }}
              observe={functions.observeLowerBorder}
            />
            {!!state.messages.length &&
              groupMessagesByDate(state.messages).map((dateGroup) => (
                <div
                  key={dateGroup.date.valueOf()}
                  className="flex flex-col-reverse gap-2"
                >
                  {dateGroup.messages.map((message) => {
                    const isLastUnreadMessage =
                      refs.lastUnreadMessageRef.current.message?.id === message.id;
                    const isFirstFoundMessage = state.scrollToMessage?.id === message.id;

                    const onClickCopy = () =>
                      navigator.clipboard.writeText(message.message).catch();
                    const onClickDelete = () => functions.setDeleteMessage(message);

                    return (
                      <Fragment key={message.id}>
                        <MessageContextMenu
                          onClickCopy={onClickCopy}
                          onClickDelete={onClickDelete}
                          showDeleteButton={message.userId === state.user?.id}
                        >
                          <MessageItem
                            ref={(node) => {
                              if (isFirstFoundMessage) {
                                refs.scrollToMessageNodeRef.current = node;
                              }
                            }}
                            message={message}
                          />
                        </MessageContextMenu>
                        {isLastUnreadMessage && (
                          <div
                            ref={(node) => {
                              if (isLastUnreadMessage) {
                                refs.lastUnreadMessageRef.current.node = node;
                              }
                            }}
                            className="rounded bg-primary-700/25 text-center text-sm font-medium text-white"
                          >
                            {state.intl.t('page.home.middleColumn.unreadedMessages')}
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
        {!state.messages.length && (
          <div className="flex h-full items-center justify-center">
            <CircularProgress />
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
