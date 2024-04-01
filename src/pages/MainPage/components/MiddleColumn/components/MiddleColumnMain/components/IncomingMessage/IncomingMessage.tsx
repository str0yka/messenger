import cn from 'classnames';
import { forwardRef } from 'react';

import { IconPushPin } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { formatTime, getUserName } from '~/utils/helpers';

interface IncomingMessageProps extends React.ComponentPropsWithoutRef<'div'> {
  message: Message;
  isPinned?: boolean;
  onClickReplyMessage: (replyMessage: Message['message']['replyMessage']) => void;
}

export const IncomingMessage = forwardRef<HTMLDivElement, IncomingMessageProps>(
  ({ message, isPinned, onClickReplyMessage, ...props }, ref) => {
    const intl = useIntl();

    const messageDate = new Date(message.createdAt);
    const { hours, minutes } = formatTime(messageDate);

    return (
      <div
        ref={ref}
        className="w-fit max-w-[66%]  rounded-l-lg rounded-r-2xl bg-neutral-800 px-2 py-1 text-neutral-50"
        {...props}
      >
        {message.type === 'MESSAGE' && message.message.replyMessage && (
          <div
            className={cn(
              'mt-1 flex h-10 grow cursor-pointer flex-col justify-center overflow-hidden rounded border-l-[3px] border-primary-400 bg-primary-400/10 px-1 text-sm',
              'hover:bg-primary-400/25',
            )}
            role="button"
            tabIndex={0}
            aria-hidden
            onClick={() => onClickReplyMessage(message.message.replyMessage)}
          >
            <span className="truncate font-medium leading-4 text-primary-500">
              {getUserName(message.message.replyMessage.user)}
            </span>
            <p className="truncate leading-5 text-neutral-300/75">
              {message.message.replyMessage.message.text}
            </p>
          </div>
        )}
        {message.type === 'FORWARDED' && (
          <span className="text-sm font-medium leading-4 text-primary-400">
            {intl.t('page.home.middleColumn.main.message.forwardedFrom', {
              name: getUserName(message.message.user),
            })}
          </span>
        )}
        <div>
          {message.message.text}
          <div className="relative top-1 float-right ml-2 flex items-center gap-1 break-normal pb-0.5 text-neutral-50/50">
            {isPinned && <IconPushPin className="h-3.5 w-3.5" />}
            <span className="text-xs font-medium">
              {hours}:{minutes}
            </span>
          </div>
        </div>
      </div>
    );
  },
);
