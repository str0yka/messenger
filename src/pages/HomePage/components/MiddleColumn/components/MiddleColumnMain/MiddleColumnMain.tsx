import cn from 'classnames';
import { useState, useRef, useLayoutEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Observer } from '~/components';
import { IconButton } from '~/components/common';
import { IconChevronDown } from '~/components/common/icons';
import { useChatStore, useUserStore } from '~/utils/store';

import { useSocket } from '../../../../contexts';

import { ChatFooter, DeleteMessageDialog, MessageList } from './components';

export const MiddleColumnMain = () => {
  const user = useUserStore((state) => state.user);
  const { messages, dialog, setLastReadMessageId } = useChatStore(
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
    const goDownNode = goDownNodeRef.current;

    if (messages.length) {
      chatNode.scrollTo({ top: chatNode.scrollHeight });
    }

    const onChatScroll = () => {
      const hideClassName = 'hidden';
      const scrollBottom = chatNode.scrollHeight - (chatNode.scrollTop + chatNode.offsetHeight);

      if (scrollBottom === 0) {
        goDownNode?.classList.add(hideClassName);
      } else {
        goDownNode?.classList.remove(hideClassName);
      }
    };

    chatNode.addEventListener('scroll', onChatScroll);

    return () => {
      chatNode.removeEventListener('scroll', onChatScroll);
    };
  }, [messages.length !== 0]);

  if (!dialog) return null; // $FIXME

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
            messages={messages}
            onRead={(message) => {
              if (!lastReadMessageIdRef.current || message.id > lastReadMessageIdRef.current) {
                console.log('[HERE]: ', message.id);
                lastReadMessageIdRef.current = message.id;
                setLastReadMessageId(message.id);
              }
            }}
            setDeleteMessage={setDeleteMessage}
            userId={user!.id}
          />
          {!!messages.length && (
            <Observer
              key={Math.random()}
              observerParams={{
                root: chatNodeRef.current,
                rootMargin: '75px 0px 0px',
              }}
              observe={(entry) => {
                const minMessageId = messages.at(-1)!.id;
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
          className="absolute bottom-full right-2 -translate-y-2 transform"
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
          {!!dialog.unreadedMessagesCount && (
            <div className="pointer-events-none absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-400 text-xs">
              {dialog.unreadedMessagesCount}
            </div>
          )}
        </div>
        <ChatFooter
          onMessageSend={(messageText) => {
            const message = {
              message: messageText,
              createdAt: new Date().valueOf(),
            };
            socket.emit('message:add', message);
          }}
        />
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
