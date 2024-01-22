import cn from 'classnames';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';

import { Observer } from '~/components';
import {
  IconButton,
  Input,
  ContextMenu,
  Dialog,
  Calendar,
  Button,
  CircularProgress,
  Avatar,
} from '~/components/common';
import {
  IconSmilingFace,
  IconPaperClip,
  IconCross,
  IconPaperPlane,
  IconPapers,
  IconChevronDown,
  IconTrash,
} from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { PRIVATE_ROUTE } from '~/utils/constants';
import { createDate, isDateEqual } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../contexts';

import { DeleteMessageDialog, MessageItem, MessageItemWithObserver } from './components';

export const MiddleColumn = () => {
  const { id: partnerId } = useParams();
  const user = useUserStore((state) => state.user);
  const intl = useIntl();
  const socket = useSocket();

  const [dialog, setDialog] = useState<Parameters<ServerToClientEvents['dialog:put']>['0'] | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);
  const lastMinSendedMessageIdRef = useRef<null | number>(null);
  const lastMaxSendedMessageIdRef = useRef<null | number>(null);
  const dialogRef = useRef(dialog);
  const messageListNodeRef = useRef<HTMLDivElement>(null);
  const chatNodeRef = useRef<HTMLDivElement>(null);
  const goDownNodeRef = useRef<HTMLDivElement>(null);

  const sendMessageForm = useForm({
    defaultValues: {
      message: '',
    },
  });

  console.log('messages', messages);

  useLayoutEffect(() => {
    const isDialogCurrentlyOpen = !dialogRef.current;
    const isLastMessageSendByUser = messages.at(-1)?.userId === user!.id;

    if (chatNodeRef.current) {
      if (
        isDialogCurrentlyOpen ||
        isLastMessageSendByUser ||
        chatNodeRef.current.scrollTop + chatNodeRef.current.offsetHeight + 500 >
          chatNodeRef.current.scrollHeight
      ) {
        chatNodeRef.current?.scrollTo({ top: chatNodeRef.current.scrollHeight });
      }
    }

    dialogRef.current = dialog;

    console.log(
      chatNodeRef.current?.scrollTop,
      chatNodeRef.current?.offsetHeight,
      chatNodeRef.current?.scrollHeight,
    );

    const onChatScroll = () => {
      if (!chatNodeRef.current) return;
      const {
        scrollTop: chatScrollTop,
        offsetHeight: chatOffsetHeight,
        scrollHeight: chatScrollHeight,
      } = chatNodeRef.current;

      const hideClassName = 'hidden';
      const scrollBottom = chatScrollHeight - (chatScrollTop + chatOffsetHeight);

      if (scrollBottom === 0) {
        goDownNodeRef.current?.classList.add(hideClassName);
      } else {
        goDownNodeRef.current?.classList.remove(hideClassName);
      }
    };

    onChatScroll();

    chatNodeRef.current?.addEventListener('scroll', onChatScroll);

    return () => {
      chatNodeRef.current?.removeEventListener('scroll', onChatScroll);
    };
  }, [messages.length !== 0]);

  useEffect(() => {
    const onMessagesPatch: ServerToClientEvents['messages:patch'] = (msgs) => {
      console.log('messages:patch', msgs);
      if (msgs.length) {
        setMessages((prevMessages) => {
          if (!prevMessages.length) {
            return msgs;
          }

          if (msgs.at(0)!.id < prevMessages.at(-1)!.id) {
            return [...prevMessages, ...msgs];
          }

          if (msgs.at(-1)!.id > prevMessages.at(0)!.id) {
            return [...msgs.reverse(), ...prevMessages];
          }

          return prevMessages;
        });
      }
    };

    const onMessageAdd: ServerToClientEvents['message:add'] = (message) => {
      console.log('message:add', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const onMessageDelete: ServerToClientEvents['message:delete'] = (message) => {
      console.log('message:delete', message);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== message.id));
    };

    const onDialogPut: ServerToClientEvents['dialog:put'] = (d) => {
      console.log('dialog:put', d);
      setDialog(d);

      socket.emit('messages:get', d.id, {
        orderBy: { createdAt: 'desc' },
        take: 1,
        where: { id: { lte: 30 } },
      });
    };

    const onMessagePatch: ServerToClientEvents['message:patch'] = (message) => {
      console.log('message:patch');
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id === message.id) {
            return message;
          }
          return msg;
        }),
      );
    };

    socket.on('messages:patch', onMessagesPatch);
    socket.on('message:patch', onMessagePatch);
    socket.on('message:delete', onMessageDelete);
    socket.on('message:add', onMessageAdd);
    socket.on('dialog:put', onDialogPut);

    socket.emit('dialog:getOrCreate', Number(partnerId));

    return () => {
      socket.off('messages:patch', onMessagesPatch);
      socket.off('message:patch', onMessagePatch);
      socket.off('message:add', onMessageAdd);
      socket.off('dialog:put', onDialogPut);
      socket.off('dialog:put', onDialogPut);
    };
  }, [partnerId]);

  if (!dialog) {
    return (
      <div className="flex grow items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={cn('flex grow flex-col overflow-hidden', 'lg:static')}>
      <div className="flex cursor-pointer items-center gap-4 border-b border-b-neutral-700 bg-neutral-800 px-4 py-2">
        <div>
          <Link to={PRIVATE_ROUTE.HOME}>
            <IconButton>
              <IconCross />
            </IconButton>
          </Link>
        </div>
        <Avatar fallback={dialog.partner.email[0]} />
        <h2 className="truncate font-semibold text-neutral-50">{dialog.partner.email}</h2>
      </div>
      <div className="flex w-full grow flex-col overflow-hidden">
        <div
          ref={chatNodeRef}
          className={cn('grow overflow-auto px-2', 'md:px-0')}
        >
          <div
            ref={messageListNodeRef}
            className={cn(
              'mx-auto my-2 flex flex-col-reverse gap-2 break-words',
              'md:w-8/12',
              'xl:w-6/12',
            )}
          >
            {!!messages.length && (
              <Observer
                key={`down-observer-${messages.at(0)?.id}`}
                observerParams={{
                  root: chatNodeRef.current,
                  rootMargin: '0px 0px 75px',
                }}
                observe={(entry) => {
                  const maxMessageId = messages.at(0)!.id;
                  if (entry?.isIntersecting) {
                    console.log('DOWN INTERSECTING');
                    if (maxMessageId !== lastMaxSendedMessageIdRef.current) {
                      socket.emit('messages:get', dialog.id, {
                        orderBy: {
                          createdAt: 'asc',
                        },
                        take: 1,
                        where: {
                          id: {
                            gt: maxMessageId,
                          },
                        },
                      });
                      lastMaxSendedMessageIdRef.current = maxMessageId;
                    }
                  }
                }}
              />
            )}
            {messages.map((message, index) => {
              const isLastInArray = index === messages.length - 1;
              const isMessageSendByUser = user?.id === message.userId;
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
                        socket.emit('message:read', message.id);
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

              const onClickCopy = async () => {
                try {
                  await navigator.clipboard.writeText(message.message);
                } catch (error) {
                  console.log('Something went wrong: ', error);
                }
              };

              const onClickDelete = () => setDeleteMessage(message);

              return (
                <React.Fragment key={message.id}>
                  <ContextMenu.Root>
                    <ContextMenu.Trigger className="flex flex-col">
                      {MessageComponent}
                    </ContextMenu.Trigger>
                    <ContextMenu.Content className="w-56">
                      <ContextMenu.Item onClick={onClickCopy}>
                        {intl.t('page.home.middleColumn.main.contextMenu.item.copy')}
                        <ContextMenu.Shortcut>
                          <IconPapers />
                        </ContextMenu.Shortcut>
                      </ContextMenu.Item>
                      {message.userId === user?.id && (
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
            })}
            {!!messages.length && (
              <Observer
                key={`up-observer-${messages.at(-1)?.id}`}
                observerParams={{
                  root: chatNodeRef.current,
                  rootMargin: '75px 0px 0px',
                }}
                observe={(entry) => {
                  const minMessageId = messages.at(-1)!.id;
                  if (entry?.isIntersecting) {
                    console.log('UP INTERSECTING');
                    if (minMessageId !== lastMinSendedMessageIdRef.current) {
                      socket.emit('messages:get', dialog.id, {
                        orderBy: {
                          createdAt: 'desc',
                        },
                        take: 1,
                        where: {
                          id: {
                            lt: minMessageId,
                          },
                        },
                      });
                      lastMinSendedMessageIdRef.current = minMessageId;
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className="relative">
          <form
            className={cn(
              'mx-auto flex w-full gap-2 px-2 pb-4 pt-2',
              'md:w-8/12 md:px-0',
              'xl:w-6/12',
            )}
            onSubmit={sendMessageForm.handleSubmit((values) => {
              socket.emit('message:add', dialog.chatId, values.message);
              sendMessageForm.reset();
            })}
          >
            <Input
              placeholder={intl.t('page.home.middleColumn.footer.input.placeholder.message')}
              variant="contained"
              s="l"
              startAdornment={<IconSmilingFace />}
              endAdornment={<IconPaperClip />}
              {...sendMessageForm.register('message', { required: true })}
            />
            <div className="shrink-0">
              <IconButton
                type="submit"
                color="primary"
                s="l"
              >
                <IconPaperPlane />
              </IconButton>
            </div>
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
            </div>
          </form>
        </div>
      </div>
      <DeleteMessageDialog
        open={!!deleteMessage}
        onOpenChange={(open) => !open && setDeleteMessage(null)}
        onDelete={(deleteForEveryone) => {
          if (deleteMessage) {
            socket.emit('message:delete', deleteMessage.id, dialog.id, deleteForEveryone);
            setDeleteMessage(null);
          }
        }}
      />
    </div>
  );
};
