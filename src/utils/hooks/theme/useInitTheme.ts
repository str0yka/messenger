import { useEffect, useState } from 'react';

import { LOCAL_STORAGE_KEY } from '~/utils/constants';
import { getTheme } from '~/utils/helpers';

export const useInitTheme = () => {
  const [theme, setTheme] = useState<Theme>(getTheme());

  useEffect(() => {
    document.body.classList.add(theme);

    localStorage.setItem(LOCAL_STORAGE_KEY.THEME, theme);

    return () => document.body.classList.remove(theme);
  }, [theme]);

  return { theme, setTheme };
};
