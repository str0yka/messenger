import { isDateEqual } from './isDateEqual';

export const isToday = (date: Date) => {
  const now = new Date();

  return isDateEqual(date, now);
};
