export const formatTime = (date?: Date) => {
  const d = date ?? new Date();

  const seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : `${d.getSeconds()}`;
  const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : `${d.getMinutes()}`;
  const hours = d.getHours() < 10 ? `0${d.getHours()}` : `${d.getHours()}`;

  return { seconds, minutes, hours };
};
