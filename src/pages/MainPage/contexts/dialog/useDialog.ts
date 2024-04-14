import { useContext } from 'react';

import { DialogContext, DialogSetterContext } from './DialogContext';

export const useDialog = () => useContext(DialogContext);
export const useDialogSetter = () => useContext(DialogSetterContext);
