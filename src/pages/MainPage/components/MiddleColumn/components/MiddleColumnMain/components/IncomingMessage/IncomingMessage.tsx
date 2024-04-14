import cn from 'classnames';
import { forwardRef } from 'react';

import { ViewImage } from '~/components';
import { IconPushPin } from '~/components/common/icons';
import { useIntl } from '~/features/i18n';
import { IMAGE_URL } from '~/utils/constants';
import { formatTime, getUserName } from '~/utils/helpers';

interface IncomingMessageProps extends React.ComponentPropsWithoutRef<'div'> {
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
  onClickReplyMessage?: (replyMessageId: number) => void;
}

export const IncomingMessage = forwardRef<HTMLDivElement, IncomingMessageProps>(
  ({ type, read, message, createdAt, isPinned, onClickReplyMessage, ...props }, ref) => {
    const intl = useIntl();

    const messageDate = new Date(createdAt);
    const { hours, minutes } = formatTime(messageDate);

    return (
      <div
        ref={ref}
        className="w-fit max-w-[66%]  overflow-hidden rounded-l-lg rounded-r-2xl bg-neutral-800 px-2 py-1 text-neutral-50"
        {...props}
      >
        {type === 'MESSAGE' && message.replyMessage && (
          <div
            className={cn(
              'mt-1 flex h-10 grow cursor-pointer flex-col justify-center overflow-hidden rounded border-l-[3px] border-primary-400 bg-primary-400/10 px-1 text-sm',
              'hover:bg-primary-400/25',
              !!message.image && 'mb-3',
            )}
            role="button"
            tabIndex={0}
            aria-hidden
            onClick={() => message.replyMessage && onClickReplyMessage?.(message.replyMessage.id)}
          >
            <span className="truncate font-medium leading-4 text-primary-500">
              {getUserName(message.replyMessage.user)}
            </span>
            <p className="truncate leading-5 text-neutral-300/75">
              {message.replyMessage.message.text}
            </p>
          </div>
        )}
        {type === 'FORWARDED' && (
          <span className="text-sm font-medium leading-4 text-primary-400">
            {intl.t('page.home.middleColumn.main.message.forwardedFrom', {
              name: getUserName(message.user),
            })}
          </span>
        )}
        {!!message.image && (
          <div className={cn('-mx-2 -mt-1')}>
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
