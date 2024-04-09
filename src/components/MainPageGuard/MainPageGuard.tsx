import { Navigate, useParams } from 'react-router-dom';

import { PRIVATE_ROUTE } from '~/utils/constants';
import { isUserLinkValid } from '~/utils/helpers';

interface MainPageGuardProps {
  children?: React.ReactNode;
}

export const MainPageGuard: React.FC<MainPageGuardProps> = ({ children }) => {
  const { id: partnerId } = useParams();

  if (!isUserLinkValid(partnerId)) return <Navigate to={PRIVATE_ROUTE.HOME} />;

  return children;
};
