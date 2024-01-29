import cn from 'classnames';
import { useState, useRef, useLayoutEffect, Fragment } from 'react';

import { Observer } from '~/components';
import { isDateEqual } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { useMessages, useSocket } from '../../../../contexts';

import {
  DateButton,
  DateDialog,
  DeleteMessageDialog,
  MessageContextMenu,
  MessageItem,
  ScrollDownButton,
} from './components';

export const MiddleColumnMain = () => {
  const user = useUserStore((state) => state.user);
  const socket = useSocket();
  const messages = useMessages();

  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);

  const chatNodeRef = useRef<HTMLDivElement>(null);
  const scrollDownNodeRef = useRef<HTMLDivElement>(null);
  const lastUnreadMessageNodeRef = useRef<HTMLDivElement>(null);

  const lastUnreadMessage = [...messages]
    .reverse()
    .find((message) => !message.read && message.userId !== user?.id);

  useLayoutEffect(() => {
    if (!chatNodeRef.current) return;

    const chatNode = chatNodeRef.current;
    const scrollBottom = chatNode.scrollHeight - (chatNode.scrollTop + chatNode.offsetHeight);

    if (scrollBottom < 75) {
      chatNode.scrollTo({ top: chatNode.scrollHeight });
    }
  }, [messages]);

  useLayoutEffect(() => {
    if (!chatNodeRef.current) return () => {};

    const chatNode = chatNodeRef.current;
    const scrollDownNode = scrollDownNodeRef.current;

    if (messages.length) {
      if (lastUnreadMessageNodeRef.current) {
        return lastUnreadMessageNodeRef.current.scrollIntoView();
      }
      chatNode.scrollTo({ top: chatNode.scrollHeight });
    }

    const onChatScroll = () => {
      const hideClassName = 'hidden';
      const scrollBottom = chatNode.scrollHeight - (chatNode.scrollTop + chatNode.offsetHeight);

      if (scrollBottom < 50) {
        scrollDownNode?.classList.add(hideClassName);
      } else {
        scrollDownNode?.classList.remove(hideClassName);
      }
    };

    chatNode.addEventListener('scroll', onChatScroll);

    return () => {
      chatNode.removeEventListener('scroll', onChatScroll);
    };
  }, [messages.length !== 0]);

  return (
    <>
      <div
        ref={chatNodeRef}
        className={cn('grow overflow-auto px-2', 'md:px-0')}
      >
        <div
          className={cn(
            'mx-auto my-2 flex flex-col-reverse gap-2 break-words',
            'md:w-8/12',
            'xl:w-6/12',
          )}
        >
          {messages.map((message, index) => {
            const isLastUnreadMessage = lastUnreadMessage?.id === message.id;
            const isLastInArray = index === messages.length - 1;
            const messageDate = new Date(message.createdAt);
            const nextMessageDate = new Date(messages[index + 1]?.createdAt);
            const needToDisplayDate = isLastInArray || !isDateEqual(messageDate, nextMessageDate);

            const onClickCopy = () => navigator.clipboard.writeText(message.message).catch();
            const onClickDelete = () => setDeleteMessage(message);

            return (
              <Fragment key={message.id}>
                <MessageContextMenu
                  onClickCopy={onClickCopy}
                  onClickDelete={onClickDelete}
                  showDeleteButton={message.userId === user?.id}
                >
                  <MessageItem message={message} />
                </MessageContextMenu>
                {isLastUnreadMessage && (
                  <div
                    ref={isLastUnreadMessage ? lastUnreadMessageNodeRef : undefined}
                    className="rounded bg-primary-700/25 text-center text-sm font-medium text-white"
                  >
                    Unreaded messages
                  </div>
                )}
                {needToDisplayDate && (
                  <DateDialog>
                    <DateButton date={messageDate} />
                  </DateDialog>
                )}
              </Fragment>
            );
          })}
          {!!messages.length && (
            <Observer
              key={Math.random()}
              observerParams={{
                root: chatNodeRef.current,
                rootMargin: '250px 0px 0px 0px',
              }}
              observe={(entry) => {
                const minMessageId = messages.at(-1)!.id;
                if (entry?.isIntersecting) {
                  socket.emit('CLIENT:MESSAGES_GET', {
                    method: 'patch',
                    filter: {
                      orderBy: {
                        createdAt: 'desc',
                      },
                      take: 40,
                      where: {
                        id: {
                          lt: minMessageId,
                        },
                      },
                    },
                  });
                }
              }}
            />
          )}
        </div>
      </div>
      <div className="relative">
        <ScrollDownButton
          ref={scrollDownNodeRef}
          onScrollDown={() => {
            chatNodeRef.current?.scrollTo({
              top: chatNodeRef.current.scrollHeight,
              behavior: 'smooth',
            });
          }}
        />
      </div>
      <DeleteMessageDialog
        open={!!deleteMessage}
        onOpenChange={(open) => !open && setDeleteMessage(null)}
        onDelete={(deleteForEveryone) => {
          if (deleteMessage) {
            socket.emit('CLIENT:MESSAGE_DELETE', {
              messageId: deleteMessage.id,
              deleteForEveryone,
            });
            setDeleteMessage(null);
          }
        }}
      />
    </>
  );
};
