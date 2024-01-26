import cn from 'classnames';
import { memo } from 'react';
import { useForm } from 'react-hook-form';

import { IconButton, Input } from '~/components/common';
import { IconPaperClip, IconPaperPlane, IconSmilingFace } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';

interface ChatFooterProps {
  onMessageSend: (message: string) => void;
}

export const ChatFooter: React.FC<ChatFooterProps> = memo(({ onMessageSend }) => {
  const intl = useIntl();

  const sendMessageForm = useForm({
    defaultValues: {
      message: '',
    },
  });

  return (
    <form
      className={cn('mx-auto flex w-full gap-2 px-2 pb-4 pt-2', 'md:w-8/12 md:px-0', 'xl:w-6/12')}
      onSubmit={sendMessageForm.handleSubmit((values) => {
        onMessageSend(values.message);
        sendMessageForm.reset();
      })}
    >
      <Input
        placeholder={intl.t('page.home.middleColumn.footer.input.placeholder.message')}
        variant="contained"
        s="l"
        startAdornment={<IconSmilingFace />}
        endAdornment={<IconPaperClip />}
        {...sendMessageForm.register('message', { required: true })}
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
});
