import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { useIntl } from '~/features/i18n';
import { useUploadMutation } from '~/utils/api';
import { useSocketEvents } from '~/utils/hooks';

import { useDialog, useSocket } from '../../../../../contexts';
import { MAX_NUMBER_OF_MESSAGES } from '../../../constants';
import { useReply, useReplySetter } from '../../../contexts';
import { SendMessageFormScheme, sendMessageFormScheme } from '../constants';

export const useMiddleColumnFooter = () => {
  const location = useLocation();

  const intl = useIntl();

  const socket = useSocket();
  const dialog = useDialog();
  const replyMessage = useReply();
  const setReplyMessage = useReplySetter();

  const [isLoading, setIsLoading] = useState(true);
  const [forwardMessage, setForwardMessage] = useState<Message | null>();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const fileInputNodeRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadMutation({
    onSuccess: (data) => {
      setUploadedImage(data.fileName);
    },
  });

  const sendMessageForm = useForm<SendMessageFormScheme>({
    defaultValues: {
      text: '',
    },
    resolver: zodResolver(sendMessageFormScheme),
  });

  useSocketEvents(
    socket,
    {
      'SERVER:DIALOG_JOIN_RESPONSE': () => {
        setIsLoading(false);
      },
    },
    [],
    'MiddleColumnFooter',
  );

  const messageText = sendMessageForm.watch('text');

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (location.state && 'forwardMessage' in location.state) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setForwardMessage(location.state.forwardMessage as Message);
      window.history.replaceState({}, '');
    }
  }, [location]);

  useEffect(() => {
    setIsTyping(!!messageText);

    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [messageText]);

  useEffect(() => {
    socket.emit('CLIENT:DIALOG_UPDATE_STATUS', {
      status: isTyping ? 'TYPING' : 'NONE',
    });
  }, [isTyping]);

  const onSubmit = (image: string | null) =>
    sendMessageForm.handleSubmit((values: SendMessageFormScheme) => {
      if (values.text || image) {
        const message = {
          text: values.text || null,
          createdAt: new Date().valueOf(),
          replyMessageId: replyMessage?.id,
          image,
          type: 'MESSAGE',
        } as const;
        socket.emit('CLIENT:MESSAGE_ADD', { message });
        sendMessageForm.reset();
        setReplyMessage(null);
      }
      if (forwardMessage) {
        socket.emit('CLIENT:MESSAGE_ADD', {
          message: { type: 'FORWARDED', id: forwardMessage.message.id },
        });
        setForwardMessage(null);
      }
      if (image) {
        setUploadedImage(null);
      }
    });

  const resetForwardMessage = () => setForwardMessage(null);
  const resetReplyMessage = () => setReplyMessage(null);

  const onClickReplyMessage = () => {
    if (replyMessage) {
      socket.emit('CLIENT:JUMP_TO_MESSAGE', {
        messageId: replyMessage.id,
        take: MAX_NUMBER_OF_MESSAGES,
      });
    }
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      uploadMutation.mutateAsync({ params: formData });
    }
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
  };

  const isUploadImageDialogOpen = !!uploadedImage;
  const onUploadImageDialogOpenChange = (open: boolean) => !open && setUploadedImage(null);

  const triggerFileInput = () => fileInputNodeRef.current?.click();

  const onClickUnblock = () => {
    if (dialog) {
      socket.emit('CLIENT:DIALOG_UNBLOCK', { partnerId: dialog.partnerId });
    }
  };

  return {
    refs: {
      fileInputNodeRef,
    },
    state: {
      uploadedImage,
      forwardMessage,
      replyMessage,
      isUploadImageDialogOpen,
      dialog,
      isLoading,
    },
    form: sendMessageForm,
    functions: {
      onSubmit,
      resetForwardMessage,
      resetReplyMessage,
      onClickReplyMessage,
      onFileInputChange,
      onClickUnblock,
      onUploadImageDialogOpenChange,
      triggerFileInput,
      translate: intl.t,
    },
  };
};
