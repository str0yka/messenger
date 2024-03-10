import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { IconButton, Input } from '~/components/common';
import { IconPaperClip, IconPaperPlane, IconSmilingFace } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';

import { useSocket } from '../../../../contexts';

export const MiddleColumnFooter = () => {
  const intl = useIntl();

  const socket = useSocket();

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
      className={cn('mx-auto flex w-full gap-2 px-2 pb-4 pt-2', 'md:w-8/12 md:px-0', 'xl:w-6/12')}
      onSubmit={sendMessageForm.handleSubmit((values) => {
        const message = {
          message: values.messageText,
          createdAt: new Date().valueOf(),
        };
        socket.emit('CLIENT:MESSAGE_ADD', { message });
        sendMessageForm.reset();
      })}
    >
      <Input
        placeholder={intl.t('page.home.middleColumn.footer.input.placeholder.message')}
        variant="contained"
        s="l"
        startAdornment={<IconSmilingFace />}
        endAdornment={<IconPaperClip />}
        {...sendMessageForm.register('messageText', { required: true })}
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
    </form>
  );
};
