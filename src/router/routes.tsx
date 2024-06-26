import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { MainPageGuard, VerifyPageGuard } from '~/components';
import { AuthPage, MainPage, VerifyPage } from '~/pages';
import { LeftColumn, MiddleColumn } from '~/pages/MainPage/components';
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '~/utils/constants';

export const privateRoutes: RouteObject[] = [
  {
    path: PRIVATE_ROUTE.HOME,
    errorElement: <Navigate to={PRIVATE_ROUTE.HOME} />,
    element: <MainPage />,
    children: [
      {
        index: true,
        element: <LeftColumn />,
      },
      {
        path: PRIVATE_ROUTE.USER(':id'),
        element: (
          <>
            <LeftColumn hideWhenShrink />
            <MiddleColumn />
          </>
        ),
      },
      {
        path: '*',
        element: <Navigate to={PUBLIC_ROUTE.HOME} />,
      },
    ],
  },
];

export const publicRoutes: RouteObject[] = [
  {
    path: PUBLIC_ROUTE.HOME,
    errorElement: <Navigate to={PUBLIC_ROUTE.HOME} />,
    children: [
      {
        index: true,
        element: <AuthPage />,
      },
      {
        path: PUBLIC_ROUTE.VERIFY,
        element: (
          <VerifyPageGuard>
            <VerifyPage />
          </VerifyPageGuard>
        ),
      },
      {
        path: '*',
        element: <Navigate to={PUBLIC_ROUTE.HOME} />,
      },
    ],
  },
];
