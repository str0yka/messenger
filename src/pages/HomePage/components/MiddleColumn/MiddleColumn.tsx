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

  const canRequestMessages = useRef({ lower: false, upper: false });
  const chatNodeRef = useRef<HTMLDivElement>(null);
  const goDownNodeRef = useRef<HTMLDivElement>(null);

  const sendMessageForm = useForm({
    defaultValues: {
      message: '',
    },
  });

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

    const onDialogUpdateRequired: ServerToClientEvents['dialog:updateRequired'] = () => {
      console.log('dialog:updateRequired');
      socket.emit('dialog:getOrCreate', Number(partnerId));
    };

    const onMessagesPatch: ServerToClientEvents['messages:patch'] = (msgs) => {
      console.log('messages:patch', msgs);
      if (msgs.length) {
        canRequestMessages.current.lower = true;
        canRequestMessages.current.upper = true;
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

    const onMessageAdd: ServerToClientEvents['message:add'] = (msg) => {
      console.log('message:add', msg);
      canRequestMessages.current.lower = true;
    };

    const onMessageDelete: ServerToClientEvents['message:delete'] = (msg) => {
      console.log('message:delete', msg);
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== msg.id));
    };

    const onDialogPut: ServerToClientEvents['dialog:put'] = (d) => {
      console.log('dialog:put', d);
      setDialog(d);
    };

    const onMessagePatch: ServerToClientEvents['message:patch'] = (msg) => {
      console.log('message:patch');
      setMessages((prevMessages) =>
        prevMessages.map((message) => (msg.id === message.id ? { ...message, ...msg } : message)),
      );
    };

    socket.on('dialog:updateRequired', onDialogUpdateRequired);
    socket.on('messages:patch', onMessagesPatch);
    socket.on('message:patch', onMessagePatch);
    socket.on('message:delete', onMessageDelete);
    socket.on('message:add', onMessageAdd);
    socket.on('dialog:put', onDialogPut);

    socket.emit('dialog:getOrCreate', Number(partnerId));

    return () => {
      socket.off('dialog:updateRequired', onDialogUpdateRequired);
      socket.off('messages:patch', onMessagesPatch);
      socket.off('message:patch', onMessagePatch);
      socket.off('message:add', onMessageAdd);
      socket.off('dialog:put', onDialogPut);
      socket.off('dialog:put', onDialogPut);
    };
  }, [partnerId]);

  useEffect(() => {
    if (dialog && !messages.length) {
      socket.emit('messages:get', dialog.id, {
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    }
  }, [dialog]);

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
                  rootMargin: '0px 0px 150px',
                }}
                observe={(entry) => {
                  console.log(entry);
                  const maxMessageId = messages.at(0)!.id;
                  if (entry?.isIntersecting) {
                    if (canRequestMessages.current.lower) {
                      console.log('maxMessageId', maxMessageId);

                      canRequestMessages.current.lower = false;
                      socket.emit('messages:get', dialog.id, {
                        orderBy: {
                          createdAt: 'asc',
                        },
                        take: 40,
                        where: {
                          id: {
                            gt: maxMessageId,
                          },
                        },
                      });
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

              const onClickCopy = () => navigator.clipboard.writeText(message.message).catch();

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
                key={Math.random()}
                observerParams={{
                  root: chatNodeRef.current,
                  rootMargin: '150px 0px 0px',
                }}
                observe={(entry) => {
                  const minMessageId = messages.at(-1)!.id;
                  if (entry?.isIntersecting) {
                    if (canRequestMessages.current.upper) {
                      console.log('minMessageId', minMessageId);
                      canRequestMessages.current.upper = false;
                      socket.emit('messages:get', dialog.id, {
                        orderBy: {
                          createdAt: 'desc',
                        },
                        take: 40,
                        where: {
                          id: {
                            lt: minMessageId,
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
              {!!dialog.unreadedMessagesCount && (
                <div className="pointer-events-none absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-400 text-xs">
                  {dialog.unreadedMessagesCount}
                </div>
              )}
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
