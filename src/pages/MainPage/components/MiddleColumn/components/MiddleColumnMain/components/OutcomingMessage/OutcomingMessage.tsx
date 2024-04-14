import cn from 'classnames';
import { forwardRef } from 'react';

import { ViewImage } from '~/components';
import {
  IconCheck,
  IconDoubleCheck,
  IconEnvelopeClosed,
  IconPushPin,
} from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { IMAGE_URL } from '~/utils/constants';
import { formatTime, getUserName } from '~/utils/helpers';

interface OutcomingMessageProps extends React.ComponentPropsWithoutRef<'div'> {
  type: MessageType;
  read: boolean;
  createdAt: Date;
  message: {
    text: string;
    image: string | null;
    user: Pick<User, 'name' | 'lastname' | 'email'>;
    replyMessage: {
      id: number;
      user: Pick<User, 'name' | 'lastname' | 'email'>;
      message: {
        text: string;
      };
    } | null;
  };
  isPinned?: boolean;
  outgoing?: boolean;
  onClickReplyMessage?: (replyMessageId: number) => void;
}

export const OutcomingMessage = forwardRef<HTMLDivElement, OutcomingMessageProps>(
  ({ type, read, message, createdAt, isPinned, onClickReplyMessage, outgoing, ...props }, ref) => {
    const intl = useIntl();

    const messageDate = new Date(createdAt);
    const { hours, minutes } = formatTime(messageDate);

    return (
      <div
        ref={ref}
        {...props}
        className="w-fit max-w-[66%] self-end overflow-hidden rounded-l-2xl rounded-r-lg bg-primary-500 px-2 py-1 text-white"
      >
        {type === 'MESSAGE' && message.replyMessage && (
          <div
            className={cn(
              'mt-1 flex h-10 grow cursor-pointer flex-col justify-center overflow-hidden rounded border-l-[3px] border-white bg-white/[15%] px-1 text-sm',
              'hover:bg-white/[25%]',
              !!message.image && 'mb-3',
            )}
            role="button"
            tabIndex={0}
            aria-hidden
            onClick={() => message.replyMessage && onClickReplyMessage?.(message.replyMessage.id)}
          >
            <span className="truncate font-medium leading-4 text-white">
              {getUserName(message.replyMessage.user)}
            </span>
            <p className="truncate leading-5 text-white/75">{message.replyMessage.message.text}</p>
          </div>
        )}
        {type === 'FORWARDED' && (
          <span className="text-sm font-medium leading-4">
            {intl.t('page.home.middleColumn.main.message.forwardedFrom', {
              name: getUserName(message.user),
            })}
          </span>
        )}
        {!!message.image && (
          <div className={cn('-mx-2 -mt-1 bg-white')}>
            <ViewImage
              loading="lazy"
              width={500}
              height={500}
              aria-hidden
              src={IMAGE_URL(message.image)}
              alt={`${getUserName(message.user)}'s photo`}
            />
          </div>
        )}
        <div>
          {message.text}
          <div className="relative top-1 float-right ml-2 flex items-center gap-1 break-normal pb-0.5 text-white/50">
            {isPinned && <IconPushPin className="h-3.5 w-3.5" />}
            <span className="text-xs font-medium">
              {hours}:{minutes}
            </span>
            {!outgoing && (
              <>
                {read && <IconDoubleCheck className="w-4" />}
                {!read && <IconCheck className="w-4" />}
              </>
            )}
            {outgoing && <IconEnvelopeClosed className="w-4" />}
          </div>
        </div>
      </div>
    );
  },
);
