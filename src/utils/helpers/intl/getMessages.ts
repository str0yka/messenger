/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INTL_DEFAULT_LOCALE } from '~/utils/constants';

export const getMessages = async (locale: Locale) => {
  try {
    const localeMessages = await import(`../../../static/locales/${locale}`);
    return localeMessages.default as Record<string, string>;
  } catch {
    const defaultMessages = await import(`../../../static/locales/${INTL_DEFAULT_LOCALE}`);
    return defaultMessages.default as Record<string, string>;
  }
};
