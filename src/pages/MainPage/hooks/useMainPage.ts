import { useExtendedTheme } from '~/utils/hooks';

export const useMainPage = () => {
  const { extendedTheme } = useExtendedTheme();

  return {
    state: {
      extendedTheme,
    },
  };
};
