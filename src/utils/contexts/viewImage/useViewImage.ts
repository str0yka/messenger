import { useContext } from 'react';

import { ViewImageContext } from './ViewImageContext';

export const useViewImage = () => useContext(ViewImageContext);
