import { createDate, formatTime, isToday } from '~/utils/helpers';

export const displayDate = (date: Date, locale: Locale) => {
  const { hours, minutes } = formatTime(date);
  const { dayNumber, monthShort } = createDate({ date, locale });
  return isToday(date) ? `${hours}:${minutes}` : `${dayNumber} ${monthShort}`;
};
