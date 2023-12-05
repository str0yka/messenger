import { Navigate, type RouteObject } from 'react-router-dom';

import { AuthPage, HomePage } from '~/pages';

export const privateRoutes: RouteObject[] = [
  {
    path: '/',
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
    path: '/',
    errorElement: <Navigate to="/" />,
    children: [
      {
        index: true,
        element: <AuthPage />,
      },
    ],
  },
];
