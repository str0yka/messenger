import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useIntl } from '~/features/i18n';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../../contexts';
import { MAX_NUMBER_OF_MESSAGES } from '../contants';

export const useMiddleColumnMain = () => {
  const { id: partnerId } = useParams();
  const intl = useIntl();

  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);
  const [scrollToMessage, setScrollToMessage] = useState<Message | null>(null);

  const lastMessageInChatRef = useRef<Message>();
  const lastUnreadMessageRef = useRef<{ message?: Message; node: HTMLElement | null }>({
    node: null,
  });
  const scrollToMessageNodeRef = useRef<HTMLDivElement | null>(null);
  const chatNodeRef = useRef<HTMLDivElement | null>(null);
  const scrollDownNodeRef = useRef<HTMLDivElement | null>(null);

  const isDeleteMessageDialogOpen = !!deleteMessage;

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

  const observeLowerBorder = (entry: IntersectionObserverEntry | undefined) => {
    const lastMessage = messages.at(0);
    const isMessagesContainLastMessageInChat = !!messages.find(
      (message) => message.id === lastMessageInChatRef.current?.id,
    );

    if (entry?.isIntersecting && lastMessage && !isMessagesContainLastMessageInChat) {
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

  const observeUpperBorder = (entry: IntersectionObserverEntry | undefined) => {
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
    socket.emit('CLIENT:MESSAGES_GET', {
      filter: {
        take: MAX_NUMBER_OF_MESSAGES,
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
  };

  useLayoutEffect(() => {
    if (scrollToMessage) {
      scrollToMessageNodeRef.current?.scrollIntoView({ block: 'center' });
      setScrollToMessage(null);
    }
  }, [scrollToMessage]);

  useEffect(() => {
    const onDialogJoinResponse: ServerToClientEvents['SERVER:DIALOG_JOIN_RESPONSE'] = (data) => {
      console.log('[SERVER:DIALOG_JOIN_RESPONSE]: ', data);
      setMessages(data.messages);

      const lastUnreadMessage = [...data.messages]
        .reverse()
        .find((message) => !message.read && message.userId !== user?.id);

      lastUnreadMessageRef.current.message = lastUnreadMessage;
      lastMessageInChatRef.current = data.lastMessage;
    };

    const onDialogGetResponse: ServerToClientEvents['SERVER:DIALOG_GET_RESPONSE'] = (data) => {
      console.log('[SERVER:DIALOG_GET_RESPONSE]: ', data);
      lastMessageInChatRef.current = data.lastMessage;
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
            return [...prevMessages, ...msgs].slice(-MAX_NUMBER_OF_MESSAGES);
          if (msgs.at(-1)!.id > prevMessages.at(0)!.id)
            return [...msgs.reverse(), ...prevMessages].slice(0, MAX_NUMBER_OF_MESSAGES);
          return prevMessages;
        });
      }
    };

    const onMessageAdd: ServerToClientEvents['SERVER:MESSAGE_ADD'] = (msg) => {
      console.log('[SERVER:MESSAGE_ADD]: ', msg);

      setMessages((prevMessages) => {
        const isMessagesContainLastMessageInChat = !!prevMessages.find(
          (message) => message.id === lastMessageInChatRef.current?.id,
        );

        lastMessageInChatRef.current = msg;

        return isMessagesContainLastMessageInChat
          ? [msg, ...prevMessages].slice(0, MAX_NUMBER_OF_MESSAGES)
          : prevMessages;
      });
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

    socket.on('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
    socket.on('SERVER:DIALOG_GET_RESPONSE', onDialogGetResponse);
    socket.on('SERVER:MESSAGE_DELETE', onMessageDelete);
    socket.on('SERVER:MESSAGE_ADD', onMessageAdd);
    socket.on('SERVER:MESSAGES_PATCH', onMessagesPatch);
    socket.on('SERVER:MESSAGES_PUT', onMessagesPut);
    socket.on('SERVER:JUMP_TO_DATE_RESPONSE', onJumpToDateResponse);

    return () => {
      setMessages([]);

      socket.off('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
      socket.off('SERVER:DIALOG_GET_RESPONSE', onDialogGetResponse);
      socket.off('SERVER:MESSAGE_DELETE', onMessageDelete);
      socket.off('SERVER:MESSAGE_ADD', onMessageAdd);
      socket.off('SERVER:MESSAGES_PATCH', onMessagesPatch);
      socket.off('SERVER:MESSAGES_PUT', onMessagesPut);
      socket.off('SERVER:JUMP_TO_DATE_RESPONSE', onJumpToDateResponse);
    };
  }, [partnerId]);

  useEffect(() => {
    if (!chatNodeRef.current) throw new Error('chatNodeRef is missing');

    const chatNode = chatNodeRef.current;
    const scrollDownNode = scrollDownNodeRef.current;

    const toggleScrollButton = () => {
      const hideClassName = 'hidden';
      const chatNodeScrollBottom =
        chatNode.scrollHeight - (chatNode.scrollTop + chatNode.offsetHeight);

      if (chatNodeScrollBottom < 50) scrollDownNode?.classList.add(hideClassName);
      else scrollDownNode?.classList.remove(hideClassName);
    };

    chatNode.addEventListener('scroll', toggleScrollButton);

    return () => {
      chatNode.removeEventListener('scroll', toggleScrollButton);
    };
  }, []);

  useLayoutEffect(() => {
    if (!chatNodeRef.current) throw new Error('chatNodeRef is missing');

    const chatNode = chatNodeRef.current;
    const chatNodeScrollBottom =
      chatNode.scrollHeight - (chatNode.scrollTop + chatNode.offsetHeight);

    if (chatNodeScrollBottom < 75) chatNode.scrollTo({ top: chatNode.scrollHeight });
  }, [messages]);

  useLayoutEffect(() => {
    if (!chatNodeRef.current) throw new Error('chatNodeRef is missing');

    const chatNode = chatNodeRef.current;
    const lastUnreadMessageNode = lastUnreadMessageRef.current.node;

    if (messages.length) {
      if (lastUnreadMessageNode) lastUnreadMessageNode.scrollIntoView();
      else chatNode.scrollTo({ top: chatNode.scrollHeight });
    }
  }, [!!messages.length]);

  return {
    state: {
      user,
      intl,
      messages,
      isDeleteMessageDialogOpen,
      scrollToMessage,
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
      lastUnreadMessageRef,
      scrollToMessageNodeRef,
    },
  };
};
