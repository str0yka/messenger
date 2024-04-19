import { useIntl } from '~/features/i18n';
import { useLogoutMutation } from '~/utils/api';
import { getLanguage } from '~/utils/helpers';
import { useExtendedTheme } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

import { TAB } from '../../../constants';
import { useTabSetter } from '../../../contexts';

export const useLeftColumnSettingsTab = () => {
  const { user, resetUser } = useUserStore();
  const intl = useIntl();
  const { extendedTheme } = useExtendedTheme();

  const setTab = useTabSetter();

  const logoutMutation = useLogoutMutation({ onSuccess: resetUser });

  const language = getLanguage(intl.locale);

  const goPreviousTab = () => setTab(TAB.MAIN);
  const goProfileTab = () => setTab(TAB.PROFILE);
  const goLanguageTab = () => setTab(TAB.LANGUAGE);
  const goThemeTab = () => setTab(TAB.THEME);

  const onLogout = () => logoutMutation.mutateAsync({});

  return {
    state: {
      language,
      user,
      extendedTheme,
    },
    functions: {
      goPreviousTab,
      goProfileTab,
      goLanguageTab,
      goThemeTab,
      onLogout,
      translate: intl.t,
    },
  };
};
