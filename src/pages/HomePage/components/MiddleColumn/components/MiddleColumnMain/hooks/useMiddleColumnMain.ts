import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useIntl } from '~/features/i18n';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../../contexts';

export const useMiddleColumnMain = () => {
  const { id: partnerId } = useParams();
  const intl = useIntl();

  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);

  const lastMessageRef = useRef<Message | null>(null);
  const lastUnreadMessageRef = useRef<{ message: Message | null; node: HTMLElement | null }>({
    message: null,
    node: null,
  });
  const chatNodeRef = useRef<HTMLDivElement>(null);
  const scrollDownNodeRef = useRef<HTMLDivElement>(null);

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
    const maxMessageId = messages.at(0)!.id;
    console.log(
      '!messages.find((message) => message.id === lastMessageRef.current?.id)',
      !messages.find((message) => message.id === lastMessageRef.current?.id),
    );
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
  };

  const observeUpperBorder = (entry: IntersectionObserverEntry | undefined) => {
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
  };

  const onClickScrollDownButton = () => {
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
  };

  useEffect(() => {
    const onDialogJoinResponse: ServerToClientEvents['SERVER:DIALOG_JOIN_RESPONSE'] = (data) => {
      console.log('[SERVER:DIALOG_JOIN_RESPONSE]: ', data);
      setMessages(data.messages);

      const lastUnreadMessage = [...data.messages]
        .reverse()
        .find((message) => !message.read && message.userId !== user?.id);

      if (lastUnreadMessage) lastUnreadMessageRef.current.message = lastUnreadMessage;

      lastMessageRef.current = data.lastMessage ?? null;
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

    socket.on('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
    socket.on('SERVER:MESSAGE_DELETE', onMessageDelete);
    socket.on('SERVER:MESSAGE_ADD', onMessageAdd);
    socket.on('SERVER:MESSAGES_PATCH', onMessagesPatch);
    socket.on('SERVER:MESSAGES_PUT', onMessagesPut);

    return () => {
      setMessages([]);

      socket.off('SERVER:DIALOG_JOIN_RESPONSE', onDialogJoinResponse);
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
      if (lastUnreadMessageRef.current?.node) {
        lastUnreadMessageRef.current.node.scrollIntoView();
      } else {
        chatNode.scrollTo({ top: chatNode.scrollHeight });
      }
    }
  }, [messages.length !== 0]);

  return {
    state: {
      intl,
      partnerId,
      user,
      socket,
      messages,
      deleteMessage,
      isDeleteMessageDialogOpen,
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
      lastMessageRef,
    },
  };
};
