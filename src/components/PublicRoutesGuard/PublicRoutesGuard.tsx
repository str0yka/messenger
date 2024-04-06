import { Navigate } from 'react-router-dom';

import { PUBLIC_ROUTE } from '~/utils/constants';
import { useUserStore } from '~/utils/store';

interface PublicRoutesGuardProps {
  children?: React.ReactNode;
}

export const PublicRoutesGuard: React.FC<PublicRoutesGuardProps> = ({ children }) => {
  const user = useUserStore((state) => state.user);

  if (!user) return <Navigate to={PUBLIC_ROUTE.HOME} />;

  return children;
};
