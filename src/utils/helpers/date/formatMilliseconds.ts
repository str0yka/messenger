export const formatMilliseconds = (duration: number) => {
  const milliseconds = Math.floor((duration % 1000) / 100);
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const formattedMilliseconds = milliseconds < 10 ? `0${milliseconds}` : milliseconds;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedHours = hours < 10 ? `0${hours}` : hours;

  return {
    seconds,
    minutes,
    hours,
    milliseconds,
    formattedMilliseconds,
    formattedSeconds,
    formattedHours,
    formattedMinutes,
  };
};
