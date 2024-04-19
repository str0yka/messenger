import cn from 'classnames';
import { forwardRef } from 'react';

import { Intl, ViewImage } from '~/components';
import { IconCheck, IconDoubleCheck, IconPushPin } from '~/components/common/icons';
import { IMAGE_URL } from '~/utils/constants';
import { formatTime, getUserName } from '~/utils/helpers';

interface OutcomingMessageProps extends React.ComponentPropsWithoutRef<'div'> {
  type: MessageType;
  read: boolean;
  createdAt: Date;
  message: {
    text: string | null;
    image: string | null;
    user: Pick<User, 'name' | 'lastname' | 'email'>;
    replyMessage: {
      id: number;
      user: Pick<User, 'name' | 'lastname' | 'email'>;
      message: {
        text: string | null;
      };
    } | null;
  };
  isPinned?: boolean;
  onClickReplyMessage?: (replyMessageId: number) => void;
}

export const OutcomingMessage = forwardRef<HTMLDivElement, OutcomingMessageProps>(
  ({ type, read, message, createdAt, isPinned, onClickReplyMessage, ...props }, ref) => {
    const messageDate = new Date(createdAt);
    const { hours, minutes } = formatTime(messageDate);

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          'w-fit max-w-[66%] self-end overflow-hidden rounded-l-2xl rounded-r-lg bg-primary-500 px-2 text-white',
          {
            'py-1': !!message.text,
            'pt-1': !message.text,
          },
        )}
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
            <Intl
              path="page.home.middleColumn.main.message.forwardedFrom"
              values={{
                name: getUserName(message.user),
              }}
            />
          </span>
        )}
        {!!message.image && (
          <div className={cn('relative -mx-2 -mt-1 bg-white')}>
            <ViewImage
              loading="lazy"
              width={500}
              height={500}
              aria-hidden
              src={IMAGE_URL(message.image)}
              alt={`${getUserName(message.user)}'s photo`}
            />
            {!message.text && (
              <div className="pointer-events-none absolute bottom-1 right-1 flex items-center justify-center gap-1 rounded-full bg-black/50 px-2 text-white">
                {isPinned && <IconPushPin className="h-3.5 w-3.5" />}
                <span className="text-xs font-medium">
                  {hours}:{minutes}
                </span>
                {read && <IconDoubleCheck className="w-4" />}
                {!read && <IconCheck className="w-4" />}
              </div>
            )}
          </div>
        )}
        {message.text && (
          <div>
            {message.text}
            <div className="relative top-1 float-right ml-2 flex items-center gap-1 break-normal pb-0.5 text-white/50">
              {isPinned && <IconPushPin className="h-3.5 w-3.5" />}
              <span className="text-xs font-medium">
                {hours}:{minutes}
              </span>
              {read && <IconDoubleCheck className="w-4" />}
              {!read && <IconCheck className="w-4" />}
            </div>
          </div>
        )}
      </div>
    );
  },
);
