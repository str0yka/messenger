import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getBottomDistance } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../../contexts';
import { useReply } from '../../../contexts';
import { MAX_NUMBER_OF_MESSAGES } from '../contants';

export const useMiddleColumnMain = () => {
  const { id: partnerId } = useParams();

  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const { setReplyMessage } = useReply();

  const [messages, setMessages] = useState<Message[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);
  const [firstUnreadMessage, setFirstUnreadMessage] = useState<Message | null>(null);
  const [scrollToMessage, setScrollToMessage] = useState<Message | null>(null);
  const [lastMessageInChat, setLastMessageInChat] = useState<Message | null>(null);

  const scrollToMessageNodeRef = useRef<HTMLDivElement | null>(null);
  const chatNodeRef = useRef<HTMLDivElement | null>(null);
  const scrollDownNodeRef = useRef<HTMLDivElement | null>(null);
  const lastMessageInChatRef = useRef(lastMessageInChat);
  const isMessagesContainLastMessageInChat = useRef(
    !!messages.find((message) => message.id === lastMessageInChat?.id),
  );

  lastMessageInChatRef.current = lastMessageInChat;
  isMessagesContainLastMessageInChat.current = !!messages.find(
    (message) => message.id === lastMessageInChat?.id,
  );

  const onDeleteMessageDialogOpenChange = (open: boolean) => !open && setDeleteMessage(null);

  const onDeleteMessage = (deleteForEveryone: boolean) => {
    if (deleteMessage) {
      socket.emit('CLIENT:MESSAGE_DELETE', {
        messageId: deleteMessage.id,
        deleteForEveryone,
      });
      setDeleteMessage(null);
    }
  };

  const observeLowerBorder = (entry?: IntersectionObserverEntry) => {
    const lastMessage = messages.at(0);
    if (entry?.isIntersecting && lastMessage && !isMessagesContainLastMessageInChat.current) {
      socket.emit('CLIENT:MESSAGES_GET', {
        method: 'PATCH',
        filter: {
          orderBy: {
            createdAt: 'asc',
          },
          take: MAX_NUMBER_OF_MESSAGES / 2,
          cursor: {
            id: lastMessage.id,
          },
          skip: 1,
        },
      });
    }
  };

  const observeUpperBorder = (entry?: IntersectionObserverEntry) => {
    const firstMessage = messages.at(-1);
    if (entry?.isIntersecting && firstMessage) {
      socket.emit('CLIENT:MESSAGES_GET', {
        method: 'PATCH',
        filter: {
          orderBy: {
            createdAt: 'desc',
          },
          take: MAX_NUMBER_OF_MESSAGES / 2,
          cursor: {
            id: firstMessage.id,
          },
          skip: 1,
        },
      });
    }
  };

  const onClickScrollDownButton = () => {
    if (!lastMessageInChat || !isMessagesContainLastMessageInChat.current) {
      socket.emit('CLIENT:MESSAGES_GET', {
        filter: {
          take: MAX_NUMBER_OF_MESSAGES,
          orderBy: {
            createdAt: 'desc',
          },
        },
        method: 'PUT',
      });
    }
  };

  useLayoutEffect(() => {
    if (scrollToMessage) {
      scrollToMessageNodeRef.current?.scrollIntoView({ block: 'center' });
      setScrollToMessage(null);
    }
  }, [scrollToMessage]);

  useEffect(() => {
    const onDialogJoinResponse: ServerToClientEvents['SERVER:DIALOG_JOIN_RESPONSE'] = (data) => {
      console.log('[MiddleColumnMain:SERVER:DIALOG_JOIN_RESPONSE]: ', data);
      setMessages(data.messages);

      if (data.dialog.lastMessage) {
        setLastMessageInChat(data.dialog.lastMessage);
      }

      const firstUnreadMsg = [...data.messages]
        .reverse()
        .find((message) => !message.read && message.userId !== user?.id);

      if (firstUnreadMsg) {
        setFirstUnreadMessage(firstUnreadMsg);
        setScrollToMessage(firstUnreadMsg);
      } else {
        setScrollToMessage(data.messages.at(0) ?? null);
      }
    };

    const onMessagesPut: ServerToClientEvents['SERVER:MESSAGES_PUT'] = (data) => {
      console.log('[MiddleColumnMain:SERVER:MESSAGES_PUT]: ', data);

      const firstUnreadMsg = [...data.messages]
        .reverse()
        .find((message) => !message.read && message.userId !== user?.id);

      if (firstUnreadMsg) {
        setFirstUnreadMessage(firstUnreadMsg);
        setScrollToMessage(firstUnreadMsg);
      } else {
        setScrollToMessage(data.messages.at(0) ?? null);
      }

      setMessages(data.messages);
    };

    const onMessagesPatch: ServerToClientEvents['SERVER:MESSAGES_PATCH'] = (data) => {
      console.log('[MiddleColumnMain:SERVER:MESSAGES_PATCH]: ', data);
      if (data.messages.length) {
        setMessages((prevMessages) => {
          if (!prevMessages.length) return data.messages;
          if (data.messages.at(0)!.id < prevMessages.at(-1)!.id)
            return [...prevMessages, ...data.messages].slice(-MAX_NUMBER_OF_MESSAGES);
          if (data.messages.at(-1)!.id > prevMessages.at(0)!.id)
            return [...data.messages.reverse(), ...prevMessages].slice(0, MAX_NUMBER_OF_MESSAGES);
          return prevMessages;
        });
      }
    };

    const onMessageAdd: ServerToClientEvents['SERVER:MESSAGE_ADD'] = (data) => {
      console.log('[MiddleColumnMain:SERVER:MESSAGE_ADD]: ', data);

      if (isMessagesContainLastMessageInChat.current || !lastMessageInChatRef.current) {
        setMessages((prevMessages) =>
          [data.message, ...prevMessages].slice(0, MAX_NUMBER_OF_MESSAGES),
        );

        if (chatNodeRef.current && getBottomDistance(chatNodeRef.current) < 150) {
          setScrollToMessage(data.message);
        }
      }

      setLastMessageInChat(data.message);
    };

    const onMessageDelete: ServerToClientEvents['SERVER:MESSAGE_DELETE'] = (data) => {
      console.log('[MiddleColumnMain:SERVER:MESSAGE_DELETE]: ', data);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== data.message.id),
      );
    };

    const onJumpToDateResponse: ServerToClientEvents['SERVER:JUMP_TO_DATE_RESPONSE'] = (data) => {
      console.log('[MiddleColumnMain:SERVER:JUMP_TO_DATE_RESPONSE]: ', data);
      setMessages(data.messages);
      if (data.firstFoundMessage) {
        setScrollToMessage(data.firstFoundMessage);
      }
    };

    const onMessageReadResponse: ServerToClientEvents['SERVER:MESSAGE_READ_RESPONSE'] = (data) => {
      console.log('[MiddleColumnMain:SERVER:MESSAGE_READ_RESPONSE]: ', data);
      if (!data.unreadedMessagesCount) {
        setFirstUnreadMessage(null);
      }
    };

    socket.on('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
    socket.on('SERVER:MESSAGE_DELETE', onMessageDelete);
    socket.on('SERVER:MESSAGE_ADD', onMessageAdd);
    socket.on('SERVER:MESSAGES_PATCH', onMessagesPatch);
    socket.on('SERVER:MESSAGES_PUT', onMessagesPut);
    socket.on('SERVER:JUMP_TO_DATE_RESPONSE', onJumpToDateResponse);
    socket.on('SERVER:MESSAGE_READ_RESPONSE', onMessageReadResponse);

    return () => {
      setMessages([]);

      socket.off('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
      socket.off('SERVER:MESSAGE_DELETE', onMessageDelete);
      socket.off('SERVER:MESSAGE_ADD', onMessageAdd);
      socket.off('SERVER:MESSAGES_PATCH', onMessagesPatch);
      socket.off('SERVER:MESSAGES_PUT', onMessagesPut);
      socket.off('SERVER:JUMP_TO_DATE_RESPONSE', onJumpToDateResponse);
      socket.off('SERVER:MESSAGE_READ_RESPONSE', onMessageReadResponse);
    };
  }, [partnerId]);

  useEffect(() => {
    const toggleScrollButton = () => {
      const hideClassName = 'hidden';

      if (chatNodeRef.current && getBottomDistance(chatNodeRef.current) < 50) {
        scrollDownNodeRef.current?.classList.add(hideClassName);
      } else {
        scrollDownNodeRef.current?.classList.remove(hideClassName);
      }
    };

    chatNodeRef.current?.addEventListener('scroll', toggleScrollButton);

    return () => {
      chatNodeRef.current?.removeEventListener('scroll', toggleScrollButton);
    };
  }, []);

  return {
    state: {
      user,
      messages,
      isDeleteMessageDialogOpen: !!deleteMessage,
      scrollToMessage,
      firstUnreadMessage,
    },
    functions: {
      setDeleteMessage,
      observeUpperBorder,
      observeLowerBorder,
      onClickScrollDownButton,
      onDeleteMessageDialogOpenChange,
      onDeleteMessage,
      setReplyMessage,
    },
    refs: {
      chatNodeRef,
      scrollDownNodeRef,
      scrollToMessageNodeRef,
    },
  };
};
