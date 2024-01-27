import { Link } from 'react-router-dom';

import { IconButton, Avatar } from '~/components/common';
import { IconCross } from '~/components/common/icons';
import { PRIVATE_ROUTE } from '~/utils/constants';
import { useChatStore } from '~/utils/store';

export const MiddleColumnHeader = () => {
  const dialog = useChatStore((state) => state.dialog);

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
      <Avatar fallback={dialog.title[0]} />
      <h2 className="truncate font-semibold text-neutral-50">{dialog.title}</h2>
    </div>
  );
};
