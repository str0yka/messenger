import { useMemo, useState } from 'react';

import { Dialog } from '~/components/common';

import { ViewImageContext } from './ViewImageContext';
import type { ViewImageState } from './ViewImageContext';

interface ViewImageProviderProps {
  children?: React.ReactNode;
}

export const ViewImageProvider: React.FC<ViewImageProviderProps> = ({ children }) => {
  const [viewImage, setViewImage] = useState<ViewImageState['viewImage']>(null);

  const value = useMemo(() => ({ viewImage, setViewImage }), [viewImage]);

  return (
    <ViewImageContext.Provider value={value}>
      <Dialog.Root
        open={!!viewImage}
        onOpenChange={(open) => !open && setViewImage(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <img
              src={viewImage!}
              className="outline-none"
              alt=""
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {children}
    </ViewImageContext.Provider>
  );
};
