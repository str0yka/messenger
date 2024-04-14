import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getScrollBottom, getUserLink } from '~/utils/helpers';
import { useSocketEvents } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

import { useSocket } from '../../../../../contexts';
import { MAX_NUMBER_OF_MESSAGES } from '../../../constants';
import { useReplySetter } from '../../../contexts';

export const useMiddleColumnMain = () => {
  const navigate = useNavigate();
  const { id: partnerId } = useParams();

  const user = useUserStore((state) => state.user);
  const socket = useSocket();

  const setReplyMessage = useReplySetter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<Message | null>(null);
  const [forwardMessage, setForwardMessage] = useState<Message | null>(null);
  const [firstUnreadMessage, setFirstUnreadMessage] = useState<Message | null>(null);
  const [scrollToMessage, setScrollToMessage] = useState<Message | null>(null);
  const [lastMessageInChat, setLastMessageInChat] = useState<Message | null>(null);

  const scrollToMessageNodeRef = useRef<HTMLDivElement | null>(null);
  const chatNodeRef = useRef<HTMLDivElement | null>(null);
  const scrollDownNodeRef = useRef<HTMLDivElement | null>(null);

  const isMessagesContainLastMessageInChat = !!messages.find(
    (message) => message.id === lastMessageInChat?.id,
  );

  const onDeleteMessageDialogOpenChange = (open: boolean) => !open && setDeleteMessage(null);
  const onForwardMessageDialogOpenChange = (open: boolean) => !open && setForwardMessage(null);

  const onForwardMessage = (dialog: Dialog) => {
    navigate(`/${getUserLink(dialog.partner)}`, { state: { forwardMessage } });
    setForwardMessage(null);
  };

  const onDeleteMessage = (deleteForEveryone: boolean) => {
    if (deleteMessage) {
      socket.emit('CLIENT:MESSAGE_DELETE', {
        messageId: deleteMessage.id,
        deleteForEveryone,
      });
      setDeleteMessage(null);
    }
  };

  const onClickReplyMessage = (replyMessageId: number) => {
    socket.emit('CLIENT:JUMP_TO_MESSAGE', {
      messageId: replyMessageId,
      take: MAX_NUMBER_OF_MESSAGES,
    });
  };

  const observeLowerBorder = (entry?: IntersectionObserverEntry) => {
    const lastMessage = messages.at(0);
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
    if (!lastMessageInChat || !isMessagesContainLastMessageInChat) {
      socket.emit('CLIENT:MESSAGES_GET', {
        filter: {
          take: MAX_NUMBER_OF_MESSAGES,
          orderBy: {
            createdAt: 'desc',
          },
        },
        method: 'PUT',
      });
    } else {
      setScrollToMessage(lastMessageInChat);
    }
  };

  useLayoutEffect(() => {
    if (scrollToMessage) {
      scrollToMessageNodeRef.current?.scrollIntoView({ block: 'center' });
      setScrollToMessage(null);
    }
  }, [scrollToMessage]);

  useSocketEvents(
    socket,
    {
      'SERVER:DIALOG_JOIN_RESPONSE': (data) => {
        setMessages(data.messages);
        setPinnedMessage(data.dialog.pinnedMessage);

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
      },
      'SERVER:MESSAGES_PUT': (data) => {
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
      },
      'SERVER:MESSAGES_PATCH': (data) => {
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
      },
      'SERVER:MESSAGE_ADD': (data) => {
        if (isMessagesContainLastMessageInChat || !lastMessageInChat) {
          setMessages((prevMessages) =>
            [data.message, ...prevMessages].slice(0, MAX_NUMBER_OF_MESSAGES),
          );

          if (chatNodeRef.current && getScrollBottom(chatNodeRef.current) < 150) {
            setScrollToMessage(data.message);
          }
        }

        setLastMessageInChat(data.message);
      },
      'SERVER:MESSAGE_DELETE': (data) => {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== data.message.id),
        );
      },
      'SERVER:JUMP_TO_DATE_RESPONSE': (data) => {
        setMessages(data.messages);
        if (data.firstFoundMessage) {
          setScrollToMessage(data.firstFoundMessage);
        }
      },
      'SERVER:JUMP_TO_MESSAGE_RESPONSE': (data) => {
        setMessages(data.messages);
        if (data.target) {
          setScrollToMessage(data.target);
        }
      },
      'SERVER:MESSAGE_READ_RESPONSE': (data) => {
        if (!data.unreadedMessagesCount) {
          setFirstUnreadMessage(null);
        }
      },
      'SERVER:DIALOG_GET_RESPONSE': (data) => {
        if (pinnedMessage?.id !== data.dialog.pinnedMessage?.id) {
          setPinnedMessage(data.dialog.pinnedMessage);
        }
      },
    },
    [lastMessageInChat, pinnedMessage],
    'MiddleColumnMain',
  );

  useEffect(
    () => () => {
      setMessages([]);
    },
    [partnerId],
  );

  useEffect(() => {
    const toggleScrollButton = () => {
      const hideClassName = 'hidden';

      if (chatNodeRef.current && getScrollBottom(chatNodeRef.current) < 50) {
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

  const onClickPinMessage = (message: Message) => () => {
    socket.emit('CLIENT:MESSAGE_PIN', { messageId: message.id });
  };

  const onClickUnpinMessage = () => {
    socket.emit('CLIENT:MESSAGE_PIN', { messageId: null });
  };

  const onClickPinnedMessage = () => {
    if (pinnedMessage) {
      socket.emit('CLIENT:JUMP_TO_MESSAGE', {
        messageId: pinnedMessage.id,
        take: MAX_NUMBER_OF_MESSAGES,
      });
    }
  };

  return {
    state: {
      user,
      messages,
      isDeleteMessageDialogOpen: !!deleteMessage,
      isForwardMessageDialogOpen: !!forwardMessage,
      scrollToMessage,
      firstUnreadMessage,
      pinnedMessage,
      isMessagesContainLastMessageInChat,
    },
    functions: {
      setDeleteMessage,
      observeUpperBorder,
      observeLowerBorder,
      onClickScrollDownButton,
      onClickReplyMessage,
      onClickPinMessage,
      onClickUnpinMessage,
      onDeleteMessageDialogOpenChange,
      onForwardMessageDialogOpenChange,
      setForwardMessage,
      onDeleteMessage,
      onClickPinnedMessage,
      setReplyMessage,
      onForwardMessage,
    },
    refs: {
      chatNodeRef,
      scrollDownNodeRef,
      scrollToMessageNodeRef,
    },
  };
};
