import { useIntl } from '~/features/i18n';

import { useDialog, useSocket } from '../../../../../contexts';

export const useMiddleColumnHeader = () => {
  const intl = useIntl();

  const socket = useSocket();
  const dialog = useDialog();

  const onClickBlock = () => {
    if (dialog) {
      socket.emit('CLIENT:DIALOG_BLOCK', { partnerId: dialog.partnerId });
    }
  };

  const onClickUnblock = () => {
    if (dialog) {
      socket.emit('CLIENT:DIALOG_UNBLOCK', { partnerId: dialog.partnerId });
    }
  };

  return {
    state: {
      dialog,
    },
    functions: {
      translate: intl.t,
      onClickBlock,
      onClickUnblock,
    },
  };
};
