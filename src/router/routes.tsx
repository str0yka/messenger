import type { RouteObject } from 'react-router-dom';

import { AuthPage, HomePage } from '~/pages';

export const privateRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
];

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <AuthPage />,
  },
];
