import { Link } from 'react-router-dom';

import { Avatar, IconButton } from '~/components/common';
import { IconCross, IconDotsVertical } from '~/components/common/icons';
import { PRIVATE_ROUTE } from '~/utils/constants';

export const MiddleColumnHeaderSkeleton = () => (
  <div className="flex cursor-pointer items-center gap-4 border-b border-b-neutral-700 bg-neutral-800 px-4 py-2">
    <div>
      <Link to={PRIVATE_ROUTE.HOME}>
        <IconButton>
          <IconCross />
        </IconButton>
      </Link>
    </div>
    <div className="relative">
      <Avatar.Root className="from-neutral-700 to-neutral-700" />
    </div>
    <div className="flex grow flex-col items-start gap-1">
      <p className="h-4 w-32 rounded-full bg-neutral-700" />
      <p className="h-3 w-12 rounded-full bg-neutral-700" />
    </div>
    <IconButton>
      <IconDotsVertical />
    </IconButton>
  </div>
);
