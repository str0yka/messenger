import { createContext } from 'react';

export interface ViewImageState {
  viewImage?: string | null;
  setViewImage: React.Dispatch<React.SetStateAction<ViewImageState['viewImage']>>;
}

export const ViewImageContext = createContext<ViewImageState>({} as ViewImageState);
