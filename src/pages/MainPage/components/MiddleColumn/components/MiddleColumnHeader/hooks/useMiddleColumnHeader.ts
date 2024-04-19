import { useIntl } from '~/features/i18n';

import { useDialog } from '../../../../../contexts';

export const useMiddleColumnHeader = () => {
  const intl = useIntl();

  const dialog = useDialog();

  return {
    state: {
      dialog,
    },
    functions: {
      translate: intl.t,
    },
  };
};
