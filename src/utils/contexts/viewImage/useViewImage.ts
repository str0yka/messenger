import { useContext } from 'react';

import { ViewImageContext, ViewImageSetterContext } from './ViewImageContext';

export const useViewImage = () => useContext(ViewImageContext);
export const useViewImageSetter = () => useContext(ViewImageSetterContext);
