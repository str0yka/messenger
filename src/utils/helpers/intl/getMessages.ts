/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LOCALE_DEFAULT } from '~/utils/constants';

export const getMessages = async (locale: Locale) => {
  try {
    const localeMessages = await import(`../../../static/locales/${locale}`);
    return localeMessages.default as Record<string, string>;
  } catch {
    const defaultMessages = await import(`../../../static/locales/${LOCALE_DEFAULT}`);
    return defaultMessages.default as Record<string, string>;
  }
};
