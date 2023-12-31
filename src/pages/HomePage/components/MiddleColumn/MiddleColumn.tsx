import * as Avatar from '@radix-ui/react-avatar';
import cn from 'classnames';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';

import { IconButton, Input } from '~/components/common';
import { IconSmilingFace, IconPaperClip, IconCross } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { PRIVATE_ROUTE } from '~/utils/constants';
import { createDate, isDateEqual } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../contexts';

import { MessageItem, MessageItemWithObserver } from './components';

export const MiddleColumn = () => {
  const { id: partnerId } = useParams();
  const user = useUserStore((state) => state.user);
  const intl = useIntl();
  const socket = useSocket();

  const [dialog, setDialog] = useState<Parameters<ServerToClientEvents['dialog:put']>['0'] | null>(
    null,
  );
  const dialogRef = useRef(dialog);
  const chatNodeRef = useRef<HTMLDivElement>(null);

  const { handleSubmit, register, reset } = useForm({
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
  }, [dialog]);

  useEffect(() => {
    const onMessagesAdd: ServerToClientEvents['messages:add'] = (message) => {
      console.log('messages:add', message);
      setDialog((prevDialog) => {
        if (!prevDialog) return prevDialog;
        return { ...prevDialog, messages: [...prevDialog.messages, message] };
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
    socket.on('messages:add', onMessagesAdd);
    socket.on('dialog:put', onDialogPut);

    socket.emit('dialog:getOrCreate', Number(partnerId));

    return () => {
      socket.off('message:patch', onMessagePatch);
      socket.off('messages:add', onMessagesAdd);
      socket.off('dialog:put', onDialogPut);
    };
  }, []);

  return (
    <div
      className={cn(
        'flex grow flex-col overflow-hidden',
        dialog && 'absolute inset-0',
        'lg:static',
      )}
    >
      {dialog && (
        <>
          <div className="flex cursor-pointer items-center gap-4 border-b border-b-neutral-700 bg-neutral-800 px-4 py-2">
            <div>
              <Link to={PRIVATE_ROUTE.HOME}>
                <IconButton>
                  <IconCross />
                </IconButton>
              </Link>
            </div>
            <Avatar.Root className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary-300 to-primary-500">
              <Avatar.Fallback className="text-md  font-semibold text-white">MA</Avatar.Fallback>
            </Avatar.Root>
            <h2 className="truncate font-semibold text-neutral-50">{dialog.partner.email}</h2>
          </div>
          <div className="flex w-full grow flex-col overflow-hidden">
            <div
              ref={chatNodeRef}
              className="grow overflow-auto px-2"
            >
              <div
                className={cn(
                  'mx-auto my-2 flex flex-col gap-2 break-words',
                  'md:w-8/12',
                  'xl:w-6/12',
                )}
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

                  return (
                    <React.Fragment key={message.id}>
                      {needToDisplayDate && (
                        <div className="select-none self-center rounded-3xl bg-neutral-950/40 px-2 py-1 text-sm font-medium text-neutral-50">
                          {dayNumber} {month}
                        </div>
                      )}
                      {!message.read && !isMessageSendByUser && (
                        <MessageItemWithObserver
                          message={message}
                          sentByUser={isMessageSendByUser}
                          className="flex flex-col"
                          observe={(entry) => {
                            if (entry?.isIntersecting) {
                              socket.emit('message:read', message.id);
                            }
                          }}
                        />
                      )}
                      {!(!message.read && !isMessageSendByUser) && (
                        <MessageItem
                          message={message}
                          sentByUser={isMessageSendByUser}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <form
              className={cn('mx-auto w-full px-2 pb-4 pt-2', 'md:w-8/12', 'xl:w-6/12')}
              onSubmit={handleSubmit((values) => {
                socket.emit('messages:add', dialog.chatId, values.message);
                reset();
              })}
            >
              <Input
                placeholder={intl.t('page.home.middleColumn.footer.input.placeholder.message')}
                startAdornment={<IconSmilingFace />}
                endAdornment={<IconPaperClip />}
                {...register('message', { required: true })}
              />
            </form>
          </div>
        </>
      )}
    </div>
  );
};
