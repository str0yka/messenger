interface CreateDateParams {
  date?: Date;
  locale?: string;
}

export const createDate = (params?: CreateDateParams) => {
  const locale = params?.locale ?? 'default';
  const d = params?.date ?? new Date();

  const dayNumber = d.getDate();
  const day = d.toLocaleString(locale, { weekday: 'long' });
  const dayShort = d.toLocaleString(locale, { weekday: 'short' });
  const dayNumberInWeek = d.getDay() + 1;
  const month = d.toLocaleString(locale, { month: 'long' });
  const monthShort = d.toLocaleString(locale, { month: 'short' });
  const monthIndex = d.getMonth();
  const monthNumber = d.getMonth() + 1;
  const year = d.getFullYear();
  const yearShort = d.toLocaleString(locale, { year: '2-digit' });
  const timestamp = d.getTime();

  return {
    date: d,
    day,
    dayNumber,
    dayShort,
    dayNumberInWeek,
    month,
    monthShort,
    monthIndex,
    monthNumber,
    year,
    yearShort,
    timestamp,
  };
};
