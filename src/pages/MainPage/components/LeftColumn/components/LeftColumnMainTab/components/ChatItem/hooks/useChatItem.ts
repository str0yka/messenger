import { useIntl } from '~/features/i18n';

export const useChatItem = () => {
  const intl = useIntl();

  return {
    state: {
      locale: intl.locale,
    },
  };
};
