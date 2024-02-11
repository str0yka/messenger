import { useState } from 'react';

import type { DialogState } from './DialogContext';
import { DialogContext, SetDialogContext } from './DialogContext';

interface DialogProviderProps {
  children: React.ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogState>(null);

  return (
    <DialogContext.Provider value={dialog}>
      <SetDialogContext.Provider value={setDialog}>{children}</SetDialogContext.Provider>
    </DialogContext.Provider>
  );
};
