import cn from 'classnames';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';

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
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);
  const dialogRef = useRef(dialog);
  const chatNodeRef = useRef<HTMLDivElement>(null);
  const goDownNodeRef = useRef<HTMLDivElement>(null);

  const sendMessageForm = useForm({
    defaultValues: {
      message: '',
    },
  });

  useLayoutEffect(() => {
    const isDialogCurrentlyOpen = !dialogRef.current;
    const isLastMessageSendByUser = dialog?.messages.at(-1)?.userId === user!.id;

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
  }, [dialog]);

  useEffect(() => {
    const onMessagesAdd: ServerToClientEvents['messages:add'] = (message) => {
      console.log('messages:add', message);
      setDialog((prevDialog) => {
        if (!prevDialog) return prevDialog;
        return { ...prevDialog, messages: [...prevDialog.messages, message] };
      });
    };

    const onMessageDelete: ServerToClientEvents['message:delete'] = (message) => {
      console.log('message:delete', message);
      setDialog((prevDialog) => {
        if (!prevDialog) return prevDialog;
        return {
          ...prevDialog,
          messages: prevDialog.messages.filter((dialogMessage) => dialogMessage.id !== message.id),
        };
      });
    };

    const onDialogPut: ServerToClientEvents['dialog:put'] = (d) => {
      console.log('dialog:put', d);
      setDialog(d);
    };

    const onMessagePatch: ServerToClientEvents['message:patch'] = (message) => {
      console.log('message:patch');
      setDialog((prevDialog) => {
        if (!prevDialog) return prevDialog;
        return {
          ...prevDialog,
          messages: prevDialog.messages.map((msg) => {
            if (msg.id === message.id) {
              return message;
            }
            return msg;
          }),
        };
      });
    };

    socket.on('message:patch', onMessagePatch);
    socket.on('message:delete', onMessageDelete);
    socket.on('messages:add', onMessagesAdd);
    socket.on('dialog:put', onDialogPut);

    socket.emit('dialog:getOrCreate', Number(partnerId));

    return () => {
      socket.off('message:patch', onMessagePatch);
      socket.off('messages:add', onMessagesAdd);
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
            className={cn('mx-auto my-2 flex flex-col gap-2 break-words', 'md:w-8/12', 'xl:w-6/12')}
          >
            {dialog.messages.map((message, index) => {
              const isMessageSendByUser = user?.id === message.userId;
              const messageDate = new Date(message.createdAt);
              const prevMessageDate = new Date(dialog.messages[index - 1]?.createdAt);
              const needToDisplayDate = !isDateEqual(messageDate, prevMessageDate);
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
                </React.Fragment>
              );
            })}
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
              socket.emit('messages:add', dialog.chatId, values.message);
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
