import { useContext } from 'react';

import { DialogContext, SetDialogContext } from './DialogContext';

export const useDialog = () => useContext(DialogContext);
export const useSetDialog = () => useContext(SetDialogContext);
