import { useIntl } from '~/features/i18n';
import { useTheme } from '~/features/theme';

export const useAuthPage = () => {
  const intl = useIntl();
  const { theme, setTheme } = useTheme();

  const handleChangeLocale = (value: string) => intl.setLocale(value as Locale);
  const handleChangeTheme = (value: string) => setTheme(value as Theme);

  return {
    state: {
      locale: intl.locale,
      theme,
    },
    functions: {
      handleChangeLocale,
      handleChangeTheme,
    },
  };
};
