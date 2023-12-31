import { Navigate, type RouteObject } from 'react-router-dom';

import { AuthPage, HomePage, VerifyPage } from '~/pages';
import { MiddleColumn } from '~/pages/HomePage/components';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '~/utils/constants';

export const privateRoutes: RouteObject[] = [
  {
    path: PRIVATE_ROUTE.HOME,
    errorElement: <Navigate to="/" />,
    element: <HomePage />,
    children: [
      {
        index: true,
        element: null,
      },
      {
        path: PRIVATE_ROUTE.USER(':id'),
        element: <MiddleColumn />,
      },
      {
        path: '*',
        element: <Navigate to="/" />,
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
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
  },
];
