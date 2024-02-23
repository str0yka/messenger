import { createDate } from '~/utils/helpers';

export const groupMessagesByDate = (messages: Message[]) => {
  const groupedMessages = new Map<number, Message[]>();

  for (let i = 0; i < messages.length; i += 1) {
    const message = messages[i];
    const messageDate = createDate({ date: new Date(message.createdAt) });
    const messagesDateTimestamp = new Date(
      `${messageDate.monthNumber}.${messageDate.dayNumber}.${messageDate.year}`,
    ).valueOf();
    const messagesInMessagesDateTimestamp = groupedMessages.get(messagesDateTimestamp);

    if (messagesInMessagesDateTimestamp) {
      groupedMessages.set(messagesDateTimestamp, [...messagesInMessagesDateTimestamp, message]);
    } else {
      groupedMessages.set(messagesDateTimestamp, [message]);
    }
  }

  console.log(
    Array.from(groupedMessages.entries()).map(([timestamp, msgs]) => ({
      date: new Date(timestamp),
      messages: msgs,
    })),
  );

  return Array.from(groupedMessages.entries()).map(([timestamp, msgs]) => ({
    date: new Date(timestamp),
    messages: msgs,
  }));
};
