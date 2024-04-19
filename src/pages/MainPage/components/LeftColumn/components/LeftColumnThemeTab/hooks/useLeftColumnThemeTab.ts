import { useExtendedTheme } from '~/utils/hooks';

import { TAB } from '../../../constants';
import { useTabSetter } from '../../../contexts';

export const useLeftColumnThemeTab = () => {
  const { extendedTheme, setTheme } = useExtendedTheme();

  const setTab = useTabSetter();

  const goPreviousTab = () => setTab(TAB.SETTINGS);

  const handleChangeTheme = (value: string) => setTheme(value as Theme);

  return {
    state: {
      extendedTheme,
    },
    functions: {
      goPreviousTab,
      handleChangeTheme,
    },
  };
};
