import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { Dialog, DropdownMenu, IconButton, Input, Button } from '~/components/common';
import {
  IconCross,
  IconPaperClip,
  IconPaperPlane,
  IconPicture,
  IconReply,
} from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { useUploadMutation } from '~/utils/api';
import { IMAGE_URL } from '~/utils/constants';
import { getUserName } from '~/utils/helpers';

import { useSocket } from '../../../../contexts';
import { MAX_NUMBER_OF_MESSAGES } from '../../constants';
import { useReply, useReplySetter } from '../../contexts';

interface SendMessageForm {
  messageText: string;
}

export const MiddleColumnFooter = () => {
  const location = useLocation();

  const intl = useIntl();

  const socket = useSocket();

  const replyMessage = useReply();
  const setReplyMessage = useReplySetter();

  const [forwardMessage, setForwardMessage] = useState<Message | null>();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const fileInputNodeRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadMutation({
    onSuccess: (data) => {
      setUploadedImage(data.fileName);
    },
  });

  const sendMessageForm = useForm<SendMessageForm>({
    defaultValues: {
      messageText: '',
    },
  });

  const messageText = sendMessageForm.watch('messageText');

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (location.state && 'forwardMessage' in location.state) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setForwardMessage(location.state.forwardMessage as Message);
      window.history.replaceState({}, ''); // $FIXME
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

  const onSubmitSendMessageForm = (image?: string | null) => (values: SendMessageForm) => {
    if (values.messageText) {
      const message = {
        text: values.messageText,
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
  };

  return (
    <>
      <form
        className={cn('mx-auto flex w-full gap-2 px-2 pb-4 pt-1', 'md:w-8/12 md:px-0', 'xl:w-6/12')}
        onSubmit={sendMessageForm.handleSubmit(onSubmitSendMessageForm())}
      >
        <div className="w-full grow">
          <AnimatePresence mode="popLayout">
            {forwardMessage && (
              <motion.div
                key="forwardMessage"
                className="flex items-center gap-2 rounded-t-2xl bg-neutral-800 px-2 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <IconReply className="-scale-x-100 text-primary-400" />
                </div>
                <div
                  className={cn(
                    'flex h-10 grow cursor-pointer flex-col justify-center overflow-hidden rounded border-l-[3px] border-primary-400 bg-primary-400/10 px-1',
                    'hover:bg-primary-400/25',
                  )}
                >
                  <p className="block truncate text-sm leading-4 text-primary-500">
                    {intl.t('page.home.middleColumn.footer.forwardMessage')}
                  </p>
                  <p className="truncate text-sm leading-5 text-neutral-300/75">
                    {getUserName(forwardMessage.message.user)}: {forwardMessage.message.text}
                  </p>
                </div>
                <div className="shrink-0">
                  <IconButton onClick={() => setForwardMessage(null)}>
                    <IconCross className="text-primary-400" />
                  </IconButton>
                </div>
              </motion.div>
            )}
            {replyMessage && (
              <motion.div
                key="replyMessage"
                className={cn('flex items-center gap-2 bg-neutral-800 px-2 pt-2', {
                  'rounded-none': forwardMessage,
                  'rounded-t-2xl': !forwardMessage,
                })}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <IconReply className="text-primary-400" />
                </div>
                <div
                  className={cn(
                    'flex h-10 grow cursor-pointer flex-col justify-center overflow-hidden rounded border-l-[3px] border-primary-400 bg-primary-400/10 px-1',
                    'hover:bg-primary-400/25',
                  )}
                  role="button"
                  tabIndex={0}
                  aria-hidden
                  onClick={() =>
                    socket.emit('CLIENT:JUMP_TO_MESSAGE', {
                      messageId: replyMessage.id,
                      take: MAX_NUMBER_OF_MESSAGES,
                    })
                  }
                >
                  <p className="block truncate text-sm leading-4 text-primary-500">
                    {intl.t('page.home.middleColumn.footer.replyTo', {
                      name: replyMessage.user.name,
                    })}
                  </p>
                  <p className="truncate text-sm leading-5 text-neutral-300/75">
                    {replyMessage.message.text}
                  </p>
                </div>
                <div className="shrink-0">
                  <IconButton onClick={() => setReplyMessage(null)}>
                    <IconCross className="text-primary-400" />
                  </IconButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Input
            placeholder={intl.t('page.home.middleColumn.footer.input.placeholder.message')}
            variant="contained"
            s="l"
            endAdornment={
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton>
                    <IconPaperClip />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="w-40">
                  <DropdownMenu.Item onClick={() => fileInputNodeRef.current?.click()}>
                    {intl.t('page.home.middleColumn.footer.files.images')}
                    <DropdownMenu.Shortcut>
                      <IconPicture />
                    </DropdownMenu.Shortcut>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            }
            labelProps={{
              style: { outline: 'none' },
              className: cn((replyMessage || forwardMessage) && 'rounded-none rounded-b-2xl'),
            }}
            {...sendMessageForm.register('messageText')}
          />
        </div>
        <div className="shrink-0 self-end">
          <IconButton
            type="submit"
            color="primary"
            s="l"
          >
            <IconPaperPlane />
          </IconButton>
        </div>
      </form>
      <input
        ref={fileInputNodeRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) {
            const formData = new FormData();
            formData.append('image', event.target.files[0]);
            uploadMutation.mutateAsync({ params: formData });
          }
          // eslint-disable-next-line no-param-reassign
          event.target.value = '';
        }}
      />
      <Dialog.Root
        open={!!uploadedImage}
        onOpenChange={(open) => !open && setUploadedImage(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content className="flex w-80 flex-col gap-2 rounded-xl bg-neutral-800 p-4">
            <div className="flex items-center gap-4 text-lg font-semibold">
              <Dialog.Close asChild>
                <IconButton>
                  <IconCross />
                </IconButton>
              </Dialog.Close>
              {intl.t('page.home.middleColumn.footer.sendPhotosDialog.title', { number: 1 })}
            </div>
            <img
              className="rounded-lg"
              src={IMAGE_URL(uploadedImage)}
              alt="uploaded"
            />
            <form
              className="flex flex-col gap-2"
              onSubmit={sendMessageForm.handleSubmit(onSubmitSendMessageForm(uploadedImage))}
            >
              <Input
                labelProps={{ className: 'grow' }}
                variant="outlined"
                placeholder={intl.t(
                  'page.home.middleColumn.footer.sendPhotosDialog.input.placeholder.caption',
                )}
                {...sendMessageForm.register('messageText')}
              />
              <Button
                color="primary"
                type="submit"
              >
                {intl.t('page.home.middleColumn.footer.sendPhotosDialog.button.send')}
              </Button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
