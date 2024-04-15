import { useIntl } from '~/features/i18n';

import { TAB } from '../../../constants';
import { useTabSetter } from '../../../contexts';

export const useLeftColumnLanguageTab = () => {
  const intl = useIntl();
  const setTab = useTabSetter();

  const handleChangeLocale = (value: string) => intl.setLocale(value as Locale);
  const goPreviousTab = () => setTab(TAB.SETTINGS);

  return {
    state: {
      locale: intl.locale,
    },
    functions: {
      translate: intl.t,
      setLocale: intl.setLocale,
      handleChangeLocale,
      goPreviousTab,
    },
  };
};
