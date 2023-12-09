import { Navigate, type RouteObject } from 'react-router-dom';

import { AuthPage, HomePage, VerifyPage } from '~/pages';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '~/utils/constants';

export const privateRoutes: RouteObject[] = [
  {
    path: PRIVATE_ROUTE.HOME,
    errorElement: <Navigate to="/" />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
];

export const publicRoutes: RouteObject[] = [
  {
    path: PUBLIC_ROUTE.HOME,
    errorElement: <Navigate to="/" />,
    children: [
      {
        index: true,
        element: <AuthPage />,
      },
      {
        path: PUBLIC_ROUTE.VERIFY,
        element: <VerifyPage />,
      },
    ],
  },
];
