import { Link } from 'react-router-dom';

import { IconButton, Avatar } from '~/components/common';
import { IconCross } from '~/components/common/icons';
import { PRIVATE_ROUTE } from '~/utils/constants';
import { getUserName } from '~/utils/helpers';

import { useDialog } from '../../../../contexts';

export const MiddleColumnHeader = () => {
  const dialog = useDialog();

  if (!dialog) return null; // $FIXME

  return (
    <div className="flex cursor-pointer items-center gap-4 border-b border-b-neutral-700 bg-neutral-800 px-4 py-2">
      <div>
        <Link to={PRIVATE_ROUTE.HOME}>
          <IconButton>
            <IconCross />
          </IconButton>
        </Link>
      </div>
      <Avatar fallback={getUserName(dialog.partner)[0]} />
      <h2 className="truncate font-semibold text-neutral-50">{getUserName(dialog.partner)}</h2>
    </div>
  );
};
