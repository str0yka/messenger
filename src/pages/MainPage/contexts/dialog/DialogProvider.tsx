import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useSocketEvents } from '~/utils/hooks';

import { useSocket } from '../socket';

import type { DialogState } from './DialogContext';
import { DialogContext, DialogSetterContext } from './DialogContext';

interface DialogProviderProps {
  children?: React.ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const { id: partnerId } = useParams();

  const socket = useSocket();

  const [dialog, setDialog] = useState<DialogState>(null);

  useSocketEvents(
    socket,
    {
      'SERVER:DIALOG_JOIN_RESPONSE': (data) => {
        setDialog(data.dialog);
      },
      'SERVER:DIALOG_GET_RESPONSE': (data) => {
        setDialog(data.dialog);
      },
      'SERVER:DIALOG_NEED_TO_UPDATE': () => {
        socket.emit('CLIENT:DIALOG_GET');
      },
      'SERVER:ERROR': () => {},
    },
    [],
    'DialogProvider',
  );

  useEffect(() => {
    if (partnerId) {
      socket.emit('CLIENT:DIALOG_JOIN', {
        partner: {
          ...(partnerId.charAt(0) === '@'
            ? { username: partnerId.slice(1) }
            : { id: Number(partnerId) }),
        },
      });
    }

    return () => {
      setDialog(null);
    };
  }, [partnerId]);

  return (
    <DialogContext.Provider value={dialog}>
      <DialogSetterContext.Provider value={setDialog}>{children}</DialogSetterContext.Provider>
    </DialogContext.Provider>
  );
};
