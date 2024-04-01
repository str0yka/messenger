export const groupMessagesByDate = (messages: Message[]) => {
  const groupedMessages = new Map<number, Message[]>();

  for (let i = 0; i < messages.length; i += 1) {
    const messagesDateTimestamp = new Date(messages[i].createdAt).setHours(0o0, 0o0, 0o0, 0o0);
    const messagesInMessagesDateTimestamp = groupedMessages.get(messagesDateTimestamp);
    groupedMessages.set(
      messagesDateTimestamp,
      messagesInMessagesDateTimestamp
        ? [...messagesInMessagesDateTimestamp, messages[i]]
        : [messages[i]],
    );
  }

  return Array.from(groupedMessages.entries()).map(([timestamp, msgs]) => ({
    date: new Date(timestamp),
    messages: msgs.sort(
      (firstMsg, secondMsg) => firstMsg.createdAt.valueOf() - secondMsg.createdAt.valueOf(),
    ),
  }));
};
