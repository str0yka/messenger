import cn from 'classnames';
import { useState, useRef, useLayoutEffect, Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Observer } from '~/components';
import { isDateEqual } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../contexts';

import {
  DateButton,
  DateDialog,
  DeleteMessageDialog,
  MessageContextMenu,
  MessageItem,
  ScrollDownButton,
} from './components';

export const MiddleColumnMain = () => {
  const { id: partnerId } = useParams();

  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);

  const chatNodeRef = useRef<HTMLDivElement>(null);
  const scrollDownNodeRef = useRef<HTMLDivElement>(null);
  const lastUnreadMessageNodeRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<Message | null>(null);

  const lastUnreadMessage = [...messages]
    .reverse()
    .find((message) => !message.read && message.userId !== user?.id); // $FIXME

  useEffect(() => {
    const onGetDialogResponse: ServerToClientEvents['SERVER:GET_DIALOG_RESPONSE'] = (data) => {
      console.log('[SERVER:GET_DIALOG_RESPONSE]: ', data);
      if (data.messages.length) {
        setMessages(data.messages);
        lastMessageRef.current = data.messages.at(0)!;
      }
    };

    const onMessagesPut: ServerToClientEvents['SERVER:MESSAGES_PUT'] = (msgs) => {
      console.log('[SERVER:MESSAGES_PUT]: ', msgs);
      setMessages(msgs);
    };

    const onMessagesPatch: ServerToClientEvents['SERVER:MESSAGES_PATCH'] = (msgs) => {
      console.log('[SERVER:MESSAGES_PATCH]: ', msgs);
      if (msgs.length) {
        setMessages((prevMessages) => {
          if (!prevMessages.length) return msgs;
          if (msgs.at(0)!.id < prevMessages.at(-1)!.id)
            return [...prevMessages, ...msgs].slice(-80);
          if (msgs.at(-1)!.id > prevMessages.at(0)!.id)
            return [...msgs.reverse(), ...prevMessages].slice(0, 80);
          return prevMessages;
        });
      }
    };

    const onMessageAdd: ServerToClientEvents['SERVER:MESSAGE_ADD'] = (msg) => {
      console.log('[SERVER:MESSAGE_ADD]: ', msg, messages);

      setMessages((prevMessages) => {
        const isLastMessageInMessages = !!prevMessages.find(
          (message) => message.id === lastMessageRef.current?.id,
        );

        lastMessageRef.current = msg;

        return isLastMessageInMessages ? [msg, ...prevMessages].slice(0, 80) : prevMessages;
      });
    };

    const onMessageDelete: ServerToClientEvents['SERVER:MESSAGE_DELETE'] = (msg) => {
      console.log('[SERVER:MESSAGE_DELETE]: ', msg);
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== msg.id));
    };

    socket.on('SERVER:GET_DIALOG_RESPONSE', onGetDialogResponse);
    socket.on('SERVER:MESSAGE_DELETE', onMessageDelete);
    socket.on('SERVER:MESSAGE_ADD', onMessageAdd);
    socket.on('SERVER:MESSAGES_PATCH', onMessagesPatch);
    socket.on('SERVER:MESSAGES_PUT', onMessagesPut);

    return () => {
      setMessages([]);

      socket.off('SERVER:GET_DIALOG_RESPONSE', onGetDialogResponse);
      socket.off('SERVER:MESSAGE_DELETE', onMessageDelete);
      socket.on('SERVER:MESSAGE_ADD', onMessageAdd);
      socket.off('SERVER:MESSAGES_PATCH', onMessagesPatch);
      socket.off('SERVER:MESSAGES_PUT', onMessagesPut);
    };
  }, [partnerId]);

  useEffect(() => {
    if (!chatNodeRef.current) return () => {};

    const chatNode = chatNodeRef.current;
    const scrollDownNode = scrollDownNodeRef.current;

    const toggleScrollButton = () => {
      const hideClassName = 'hidden';
      const scrollBottom = chatNode.scrollHeight - (chatNode.scrollTop + chatNode.offsetHeight);

      if (scrollBottom < 50) {
        scrollDownNode?.classList.add(hideClassName);
      } else {
        scrollDownNode?.classList.remove(hideClassName);
      }
    };

    chatNode.addEventListener('scroll', toggleScrollButton);

    return () => {
      chatNode.removeEventListener('scroll', toggleScrollButton);
    };
  }, []);

  useLayoutEffect(() => {
    if (!chatNodeRef.current) return;

    const chatNode = chatNodeRef.current;
    const scrollBottom = chatNode.scrollHeight - (chatNode.scrollTop + chatNode.offsetHeight);

    if (scrollBottom < 75) {
      chatNode.scrollTo({ top: chatNode.scrollHeight });
    }
  }, [messages]);

  useLayoutEffect(() => {
    if (!chatNodeRef.current) return;

    const chatNode = chatNodeRef.current;

    if (messages.length) {
      if (lastUnreadMessageNodeRef.current) {
        lastUnreadMessageNodeRef.current.scrollIntoView();
      } else {
        chatNode.scrollTo({ top: chatNode.scrollHeight });
      }
    }
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
          {!!messages.length && (
            <Observer
              key={Math.random()}
              observerParams={{
                root: chatNodeRef.current,
                rootMargin: '0px 0px 250px 0px',
              }}
              observe={(entry) => {
                const maxMessageId = messages.at(0)!.id;
                if (
                  entry?.isIntersecting &&
                  !messages.find((message) => message.id === lastMessageRef.current?.id)
                ) {
                  socket.emit('CLIENT:MESSAGES_GET', {
                    method: 'PATCH',
                    filter: {
                      orderBy: {
                        createdAt: 'asc',
                      },
                      take: 40,
                      cursor: {
                        id: maxMessageId,
                      },
                      skip: 1,
                    },
                  });
                }
              }}
            />
          )}
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
                    method: 'PATCH',
                    filter: {
                      orderBy: {
                        createdAt: 'desc',
                      },
                      take: 40,
                      cursor: {
                        id: minMessageId,
                      },
                      skip: 1,
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
            socket.emit('CLIENT:MESSAGES_GET', {
              filter: {
                take: 40,
                orderBy: {
                  createdAt: 'desc',
                },
              },
              method: 'PUT',
            });

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
