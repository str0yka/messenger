import cn from 'classnames';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

import { Observer } from '~/components';
import { IconButton } from '~/components/common';
import { IconChevronDown } from '~/components/common/icons';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../contexts';

import { ChatFooter, DeleteMessageDialog, MessageList } from './components';

interface ChatProps {
  dialogId: number;
  chatId: number;
  unreadedMessagesCount: number;
}

export const Chat: React.FC<ChatProps> = ({ dialogId, chatId, unreadedMessagesCount }) => {
  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const [phanthomMessages, setPhanthomMessages] = useState<
    { message: string; createdAt: number }[]
  >([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);

  const canRequestMessages = useRef({ lower: false, upper: false });
  const chatNodeRef = useRef<HTMLDivElement>(null);
  const goDownNodeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chatNodeRef.current) return () => {};

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

  useEffect(() => {
    setMessages([]);

    const onMessagesPut: ServerToClientEvents['messages:put'] = (msgs) => {
      console.log('messages:put', msgs);
      setMessages(msgs);
      canRequestMessages.current.lower = true;
      canRequestMessages.current.upper = true;
    };

    const onMessagesPatch: ServerToClientEvents['messages:patch'] = (msgs) => {
      console.log('messages:patch', msgs);
      if (msgs.length) {
        setMessages((prevMessages) => {
          if (!prevMessages.length) return msgs;
          if (msgs.at(0)!.id < prevMessages.at(-1)!.id) return [...prevMessages, ...msgs];
          if (msgs.at(-1)!.id > prevMessages.at(0)!.id) return [...msgs.reverse(), ...prevMessages];
          return prevMessages;
        });
        canRequestMessages.current.lower = true;
        canRequestMessages.current.upper = true;
      }
    };

    const onMessageAdd: ServerToClientEvents['message:add'] = (msg) => {
      console.log('message:add', msg);
      setMessages((prevMessages) => [msg, ...prevMessages].slice(0, 40));
      setPhanthomMessages((prevPhanthomMessages) =>
        prevPhanthomMessages.filter(
          (message) => new Date(message.createdAt).valueOf() !== new Date(msg.createdAt).valueOf(),
        ),
      );
    };

    const onMessageDelete: ServerToClientEvents['message:delete'] = (msg) => {
      console.log('message:delete', msg);
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== msg.id));
    };

    const onMessagePatch: ServerToClientEvents['message:patch'] = (msg) => {
      console.log('message:patch');
      setMessages((prevMessages) =>
        prevMessages.map((message) => (msg.id === message.id ? { ...message, ...msg } : message)),
      );
    };

    socket.emit('messages:get', {
      dialogId,
      filter: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 40,
      },
      method: 'put',
    });

    socket.on('messages:patch', onMessagesPatch);
    socket.on('messages:put', onMessagesPut);
    socket.on('message:patch', onMessagePatch);
    socket.on('message:delete', onMessageDelete);
    socket.on('message:add', onMessageAdd);

    return () => {
      socket.off('messages:patch', onMessagesPatch);
      socket.off('messages:put', onMessagesPut);
      socket.off('message:patch', onMessagePatch);
      socket.off('message:delete', onMessageDelete);
      socket.off('message:add', onMessageAdd);
    };
  }, [dialogId]);

  return (
    <>
      <div className="flex w-full grow flex-col overflow-hidden">
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
            {/* {!!messages.length && (
              <Observer
                key={Math.random()}
                observerParams={{
                  root: chatNodeRef.current,
                  rootMargin: '0px 0px 150px',
                }}
                observe={(entry) => {
                  const maxMessageId = messages.at(0)!.id;
                  if (entry?.isIntersecting) {
                    console.log('down');
                    if (canRequestMessages.current.lower) {
                      canRequestMessages.current.lower = false;
                      socket.emit('messages:get', {
                        dialogId,
                        method: 'patch',
                        filter: {
                          orderBy: {
                            createdAt: 'asc',
                          },
                          take: 40,
                          where: {
                            id: {
                              gt: maxMessageId,
                            },
                          },
                        },
                      });
                    }
                  }
                }}
              />
            )} */}
            {phanthomMessages.map((message) => (
              <div
                key={message.createdAt}
                className="w-fit max-w-[66%]  self-end rounded-l-2xl rounded-r-lg bg-primary-500 px-2 py-1 text-white"
              >
                {message.message}
              </div>
            ))}
            <MessageList
              messages={messages}
              onRead={(message) => socket.emit('message:read', message.id)}
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
                    console.log('up');
                    if (canRequestMessages.current.upper) {
                      canRequestMessages.current.upper = false;
                      socket.emit('messages:get', {
                        dialogId,
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
            {!!unreadedMessagesCount && (
              <div className="pointer-events-none absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-400 text-xs">
                {unreadedMessagesCount}
              </div>
            )}
          </div>
          <ChatFooter
            onMessageSend={(messageText) => {
              const message = {
                message: messageText,
                createdAt: new Date().valueOf(),
              };
              setPhanthomMessages((prevPhanthomMessages) => [message, ...prevPhanthomMessages]);
              socket.emit('message:add', chatId, message);
            }}
          />
        </div>
      </div>
      <DeleteMessageDialog
        open={!!deleteMessage}
        onOpenChange={(open) => !open && setDeleteMessage(null)}
        onDelete={(deleteForEveryone) => {
          if (deleteMessage) {
            socket.emit('message:delete', deleteMessage.id, dialogId, deleteForEveryone);
            setDeleteMessage(null);
          }
        }}
      />
    </>
  );
};
