import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getBottomDistance } from '~/utils/helpers';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../../contexts';
import { MAX_NUMBER_OF_MESSAGES } from '../contants';

export const useMiddleColumnMain = () => {
  const { id: partnerId } = useParams();

  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);
  const [firstUnreadMessage, setFirstUnreadMessage] = useState<Message | null>(null);
  const [scrollToMessage, setScrollToMessage] = useState<Message | null>(null);
  const [lastMessageInChat, setLastMessageInChat] = useState<Message | null>(null);

  const scrollToMessageNodeRef = useRef<HTMLDivElement | null>(null);
  const chatNodeRef = useRef<HTMLDivElement | null>(null);
  const scrollDownNodeRef = useRef<HTMLDivElement | null>(null);
  const isMessagesContainLastMessageInChat = useRef(
    !!messages.find((message) => message.id === lastMessageInChat?.id),
  );

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
      console.log('effect', scrollToMessage, scrollToMessageNodeRef.current);
      scrollToMessageNodeRef.current?.scrollIntoView({ block: 'center' });
      setScrollToMessage(null);
    }
  }, [scrollToMessage]);

  useEffect(() => {
    const onDialogJoinResponse: ServerToClientEvents['SERVER:DIALOG_JOIN_RESPONSE'] = (data) => {
      console.log('[SERVER:DIALOG_JOIN_RESPONSE]: ', data);
      setMessages(data.messages);

      if (data.lastMessage) {
        setLastMessageInChat(data.lastMessage);
      }

      const firstUnreadMsg = [...data.messages]
        .reverse()
        .find((message) => !message.read && message.userId !== user?.id);

      if (firstUnreadMsg) {
        setFirstUnreadMessage(firstUnreadMsg);
        setScrollToMessage(firstUnreadMessage);
      } else {
        setScrollToMessage(data.messages.at(0) ?? null);
      }
    };

    const onMessagesPut: ServerToClientEvents['SERVER:MESSAGES_PUT'] = (msgs) => {
      console.log('[SERVER:MESSAGES_PUT]: ', msgs);

      const firstUnreadMsg = [...msgs]
        .reverse()
        .find((message) => !message.read && message.userId !== user?.id);

      if (firstUnreadMsg) {
        setFirstUnreadMessage(firstUnreadMsg);
        setScrollToMessage(firstUnreadMessage);
      } else {
        setScrollToMessage(msgs.at(0) ?? null);
      }

      setMessages(msgs);
    };

    const onMessagesPatch: ServerToClientEvents['SERVER:MESSAGES_PATCH'] = (msgs) => {
      console.log('[SERVER:MESSAGES_PATCH]: ', msgs);
      if (msgs.length) {
        setMessages((prevMessages) => {
          if (!prevMessages.length) return msgs;
          if (msgs.at(0)!.id < prevMessages.at(-1)!.id)
            return [...prevMessages, ...msgs].slice(-MAX_NUMBER_OF_MESSAGES);
          if (msgs.at(-1)!.id > prevMessages.at(0)!.id)
            return [...msgs.reverse(), ...prevMessages].slice(0, MAX_NUMBER_OF_MESSAGES);
          return prevMessages;
        });
      }
    };

    const onMessageAdd: ServerToClientEvents['SERVER:MESSAGE_ADD'] = (msg) => {
      console.log('[SERVER:MESSAGE_ADD]: ', msg);

      if (isMessagesContainLastMessageInChat.current || !lastMessageInChat) {
        setMessages((prevMessages) => [msg, ...prevMessages].slice(0, MAX_NUMBER_OF_MESSAGES));

        if (chatNodeRef.current && getBottomDistance(chatNodeRef.current) < 150) {
          setScrollToMessage(msg);
        }
      }

      setLastMessageInChat(msg);
    };

    const onMessageDelete: ServerToClientEvents['SERVER:MESSAGE_DELETE'] = (msg) => {
      console.log('[SERVER:MESSAGE_DELETE]: ', msg);
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== msg.id));
    };

    const onJumpToDateResponse: ServerToClientEvents['SERVER:JUMP_TO_DATE_RESPONSE'] = (data) => {
      console.log('[SERVER:JUMP_TO_DATE_RESPONSE]: ', data);
      setMessages(data.messages);
      setScrollToMessage(data.firstFoundMessage);
    };

    const onMessageReadResponse: ServerToClientEvents['SERVER:MESSAGE_READ_RESPONSE'] = ({
      unreadedMessagesCount,
    }) => {
      if (!unreadedMessagesCount) {
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
    },
    refs: {
      chatNodeRef,
      scrollDownNodeRef,
      scrollToMessageNodeRef,
    },
  };
};
