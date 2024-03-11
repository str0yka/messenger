import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { IconButton, Input } from '~/components/common';
import {
  IconCross,
  IconPaperClip,
  IconPaperPlane,
  IconReply,
  IconSmilingFace,
} from '~/components/common/icons';
import { useIntl } from '~/features/i18n';

import { useSocket } from '../../../../contexts';
import { useReply } from '../../contexts';

export const MiddleColumnFooter = () => {
  const intl = useIntl();

  const socket = useSocket();

  const { replyMessage, setReplyMessage } = useReply();

  const [isTyping, setIsTyping] = useState(false);

  const sendMessageForm = useForm({
    defaultValues: {
      messageText: '',
    },
  });

  const messageText = sendMessageForm.watch('messageText');

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
    socket.emit('CLIENT:UPDATE_DIALOG_STATUS', {
      status: isTyping ? 'TYPING' : 'NONE',
    });
  }, [isTyping]);

  return (
    <form
      className={cn('mx-auto flex w-full gap-2 px-2 pb-4 pt-1', 'md:w-8/12 md:px-0', 'xl:w-6/12')}
      onSubmit={sendMessageForm.handleSubmit((values) => {
        const message = {
          message: values.messageText,
          createdAt: new Date().valueOf(),
          replyMessageId: replyMessage?.id,
        };
        socket.emit('CLIENT:MESSAGE_ADD', { message });
        sendMessageForm.reset();
      })}
    >
      <div className="grow">
        <AnimatePresence mode="popLayout">
          {replyMessage && (
            <motion.div
              className="flex items-center gap-2 rounded-t-2xl bg-neutral-800 px-2 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, type: 'spring' }}
            >
              <div className="flex h-10 w-10 items-center justify-center">
                <IconReply className="text-primary-400" />
              </div>
              <div className="h-10 grow rounded border-l-[3px] border-primary-400 bg-primary-400/25">
                <p>{replyMessage.message}</p>
              </div>
              <IconButton onClick={() => setReplyMessage(null)}>
                <IconCross className="text-primary-400" />
              </IconButton>
            </motion.div>
          )}
        </AnimatePresence>
        <Input
          placeholder={intl.t('page.home.middleColumn.footer.input.placeholder.message')}
          variant="contained"
          s="l"
          startAdornment={<IconSmilingFace />}
          endAdornment={<IconPaperClip />}
          labelProps={{
            style: { outline: 'none' },
            className: replyMessage ? 'rounded-none rounded-b-2xl' : '',
          }}
          {...sendMessageForm.register('messageText', { required: true })}
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
  );
};
