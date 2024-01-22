export const isThisYear = (date: Date) => {
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
};
