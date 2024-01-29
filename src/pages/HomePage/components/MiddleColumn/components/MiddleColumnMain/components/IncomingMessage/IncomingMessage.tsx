import { formatTime } from '~/utils/helpers';

interface IncomingMessageProps {
  message: Message;
}

export const IncomingMessage: React.FC<IncomingMessageProps> = ({ message }) => {
  const messageDate = new Date(message.createdAt);
  const { hours, minutes } = formatTime(messageDate);

  return (
    <div className="w-fit max-w-[66%]  rounded-l-lg rounded-r-2xl bg-neutral-800 px-2 py-1 text-neutral-50">
      {message.message}
      <div className="relative top-1 float-right ml-2 flex gap-1 break-normal pb-0.5">
        <span className="text-xs font-medium text-neutral-50/50">
          {hours}:{minutes}
        </span>
      </div>
    </div>
  );
};
