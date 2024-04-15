import { useEffect, useState } from 'react';

import {
  useDialogsPinMutation,
  useDialogsReorderMutation,
  useDialogsUnpinMutation,
} from '~/utils/api';
import { useSocketEvents } from '~/utils/hooks';
import { useUserStore } from '~/utils/store';

import { useSocket, useDialog } from '../../../../../../../contexts';

export const useChatList = () => {
  const user = useUserStore((state) => state.user);

  const socket = useSocket();
  const activeDialog = useDialog();

  const [dialogs, setDialogs] = useState<{
    pinned: Dialog[];
    unpinned: Dialog[];
  }>({ pinned: [], unpinned: [] });

  const dialogReorderMutation = useDialogsReorderMutation({
    onSuccess: (response) => setDialogs(response.dialogs),
  });
  const dialogPinMutation = useDialogsPinMutation({
    onSuccess: (response) => setDialogs(response.dialogs),
  });
  const dialogUnpinMutation = useDialogsUnpinMutation({
    onSuccess: (response) => setDialogs(response.dialogs),
  });

  useSocketEvents(
    socket,
    {
      'SERVER:DIALOGS_NEED_TO_UPDATE': () => {
        socket.emit('CLIENT:DIALOGS_GET');
      },
      'SERVER:DIALOGS_PUT': (data) => {
        setDialogs(data.dialogs);
      },
    },
    [],
    'LeftChatList',
  );

  useEffect(() => {
    socket.emit('CLIENT:DIALOGS_GET');
  }, []);

  const onReorderDialogs = (pinnedDialogs: Dialog[]) => {
    setDialogs((prevDialogs) => ({ ...prevDialogs, pinned: pinnedDialogs }));
    dialogReorderMutation.mutateAsync({
      params: {
        dialogs: pinnedDialogs.map((dialog, index) => ({
          dialogId: dialog.id,
          order: index + 1,
        })),
      },
    });
  };

  const onPinDialog = (dialogId: number) => () => {
    dialogPinMutation.mutateAsync({ params: { dialogId } });
  };

  const onUnpinDialog = (dialogId: number) => () => {
    dialogUnpinMutation.mutateAsync({ params: { dialogId } });
  };

  const onDeleteDialog = (dialogId: number) => () => {
    socket.emit('CLIENT:DIALOG_DELETE', { dialogId });
  };

  return {
    state: {
      user,
      dialogs,
      activeDialog,
    },
    functions: {
      onReorderDialogs,
      onPinDialog,
      onUnpinDialog,
      onDeleteDialog,
    },
  };
};
