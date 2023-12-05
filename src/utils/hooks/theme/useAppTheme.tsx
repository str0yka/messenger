import { useState, useEffect } from 'react';

import { THEME_LOCAL_STORAGE_KEY } from '~/utils/constants';
import { getTheme } from '~/utils/helpers';

export const useAppTheme = () => {
  const [theme, setTheme] = useState<Theme>(getTheme());

  useEffect(() => {
    document.body.classList.add(theme);

    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);

    return () => document.body.classList.remove(theme);
  }, [theme]);

  return {
    state: {
      theme,
    },
    func: {
      setTheme,
    },
  };
};
