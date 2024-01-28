import cn from 'classnames';
import { useState, useRef, useLayoutEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Observer } from '~/components';
import { IconButton } from '~/components/common';
import { IconChevronDown } from '~/components/common/icons';
import { useChatStore, useUserStore } from '~/utils/store';

import { useSocket } from '../../../../contexts';

import { DeleteMessageDialog, MessageList } from './components';

export const MiddleColumnMain = () => {
  const user = useUserStore((state) => state.user);
  const chatStore = useChatStore(
    useShallow((state) => ({
      messages: state.messages,
      dialog: state.dialog,
      setLastReadMessageId: state.setLastReadMessageId,
    })),
  );
  const socket = useSocket();

  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);

  const chatNodeRef = useRef<HTMLDivElement>(null);
  const goDownNodeRef = useRef<HTMLDivElement>(null);
  const lastReadMessageIdRef = useRef<number | null>(null);
  const lastUnreadMessageNodeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chatNodeRef.current) return;

    const chatNode = chatNodeRef.current;
    const scrollBottom = chatNode.scrollHeight - (chatNode.scrollTop + chatNode.offsetHeight);

    if (scrollBottom < 75) {
      chatNode.scrollTo({ top: chatNode.scrollHeight });
    }
  }, [chatStore.messages]);

  useLayoutEffect(() => {
    if (!chatNodeRef.current) return () => {};

    const chatNode = chatNodeRef.current;
    const goDownNode = goDownNodeRef.current;

    if (chatStore.messages.length) {
      if (lastUnreadMessageNodeRef.current) {
        return lastUnreadMessageNodeRef.current.scrollIntoView();
      }
      chatNode.scrollTo({ top: chatNode.scrollHeight });
    }

    const onChatScroll = () => {
      const hideClassName = 'hidden';
      const scrollBottom = chatNode.scrollHeight - (chatNode.scrollTop + chatNode.offsetHeight);

      if (scrollBottom < 50) {
        goDownNode?.classList.add(hideClassName);
      } else {
        goDownNode?.classList.remove(hideClassName);
      }
    };

    chatNode.addEventListener('scroll', onChatScroll);

    return () => {
      chatNode.removeEventListener('scroll', onChatScroll);
    };
  }, [chatStore.messages.length !== 0]);

  if (!chatStore.dialog) return null; // $FIXME

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
          <MessageList
            lastUnreadMessageRef={lastUnreadMessageNodeRef}
            messages={chatStore.messages}
            onRead={(message) => {
              if (!lastReadMessageIdRef.current || message.id > lastReadMessageIdRef.current) {
                lastReadMessageIdRef.current = message.id;
                chatStore.setLastReadMessageId(message.id);
              }
            }}
            setDeleteMessage={setDeleteMessage}
            userId={user!.id}
          />
          {!!chatStore.messages.length && (
            <Observer
              key={Math.random()}
              observerParams={{
                root: chatNodeRef.current,
                rootMargin: '250px 0px 0px 0px',
              }}
              observe={(entry) => {
                const minMessageId = chatStore.messages.at(-1)!.id;
                if (entry?.isIntersecting) {
                  socket.emit('messages:get', {
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
        <div
          ref={goDownNodeRef}
          className="absolute bottom-0 right-3"
        >
          <IconButton
            color="neutral"
            s="l"
            onClick={() =>
              chatNodeRef.current?.scrollTo({
                top: chatNodeRef.current.scrollHeight,
                behavior: 'smooth',
              })
            }
          >
            <IconChevronDown />
          </IconButton>
          {!!chatStore.dialog.unreadedMessagesCount && (
            <div className="pointer-events-none absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-400 text-xs">
              {chatStore.dialog.unreadedMessagesCount}
            </div>
          )}
        </div>
      </div>
      <DeleteMessageDialog
        open={!!deleteMessage}
        onOpenChange={(open) => !open && setDeleteMessage(null)}
        onDelete={(deleteForEveryone) => {
          if (deleteMessage) {
            socket.emit('message:delete', { messageId: deleteMessage.id, deleteForEveryone });
            setDeleteMessage(null);
          }
        }}
      />
    </>
  );
};
