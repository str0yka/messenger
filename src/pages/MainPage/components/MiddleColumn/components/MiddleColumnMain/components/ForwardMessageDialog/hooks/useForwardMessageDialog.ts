import { useIntl } from '~/features/i18n';
import { useDialogsQuery } from '~/utils/api';

export const useForwardMessageDialog = () => {
  const intl = useIntl();

  const dialogsQuery = useDialogsQuery();

  return {
    state: {
      dialogs: dialogsQuery.data?.dialogs.pinned.concat(dialogsQuery.data.dialogs.unpinned),
    },
    functions: {
      translate: intl.t,
    },
  };
};
