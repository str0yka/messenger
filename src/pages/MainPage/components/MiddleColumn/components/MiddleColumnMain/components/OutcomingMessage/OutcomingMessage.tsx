import cn from 'classnames';
import { forwardRef } from 'react';

import { ViewImage } from '~/components';
import { IconCheck, IconDoubleCheck, IconPushPin } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { IMAGE_URL } from '~/utils/constants';
import { formatTime, getUserName } from '~/utils/helpers';

interface OutcomingMessageProps extends React.ComponentPropsWithoutRef<'div'> {
  message: Message;
  isPinned?: boolean;
  onClickReplyMessage: (replyMessage: Message['message']['replyMessage']) => void;
}

export const OutcomingMessage = forwardRef<HTMLDivElement, OutcomingMessageProps>(
  ({ message, isPinned, onClickReplyMessage, ...props }, ref) => {
    const intl = useIntl();

    const messageDate = new Date(message.createdAt);
    const { hours, minutes } = formatTime(messageDate);

    return (
      <div
        ref={ref}
        {...props}
        className="w-fit max-w-[66%] self-end overflow-hidden rounded-l-2xl rounded-r-lg bg-primary-500 px-2 py-1 text-white"
      >
        {message.type === 'MESSAGE' && message.message.replyMessage && (
          <div
            className={cn(
              'mt-1 flex h-10 grow cursor-pointer flex-col justify-center overflow-hidden rounded border-l-[3px] border-white bg-white/[15%] px-1 text-sm',
              'hover:bg-white/[25%]',
              !!message.message.image && 'mb-3',
            )}
            role="button"
            tabIndex={0}
            aria-hidden
            onClick={() => onClickReplyMessage(message.message.replyMessage)}
          >
            <span className="truncate font-medium leading-4 text-white">
              {getUserName(message.message.replyMessage.user)}
            </span>
            <p className="truncate leading-5 text-white/75">
              {message.message.replyMessage.message.text}
            </p>
          </div>
        )}
        {message.type === 'FORWARDED' && (
          <span className="text-sm font-medium leading-4">
            {intl.t('page.home.middleColumn.main.message.forwardedFrom', {
              name: getUserName(message.message.user),
            })}
          </span>
        )}
        {!!message.message.image && (
          <div className={cn('-mx-2 -mt-1 bg-white')}>
            <ViewImage
              loading="lazy"
              width={500}
              height={500}
              aria-hidden
              src={IMAGE_URL(message.message.image)}
              alt={`${getUserName(message.message.user)}'s photo`}
            />
          </div>
        )}
        <div>
          {message.message.text}
          <div className="relative top-1 float-right ml-2 flex items-center gap-1 break-normal pb-0.5 text-white/50">
            {isPinned && <IconPushPin className="h-3.5 w-3.5" />}
            <span className="text-xs font-medium">
              {hours}:{minutes}
            </span>
            {message.read && <IconDoubleCheck className="w-4" />}
            {!message.read && <IconCheck className="w-4" />}
          </div>
        </div>
      </div>
    );
  },
);
