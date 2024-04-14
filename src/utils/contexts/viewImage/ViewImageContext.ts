import { createContext } from 'react';

export type ViewImageState = string | null | undefined;
export type ViewImageSetterState = React.Dispatch<React.SetStateAction<ViewImageState>>;

export const ViewImageContext = createContext<ViewImageState>(null);
export const ViewImageSetterContext = createContext<ViewImageSetterState>(() => {});
