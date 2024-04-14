import { useState } from 'react';

import { Dialog } from '~/components/common';

import { ViewImageContext, ViewImageSetterContext } from './ViewImageContext';
import type { ViewImageState } from './ViewImageContext';

interface ViewImageProviderProps {
  children?: React.ReactNode;
}

export const ViewImageProvider: React.FC<ViewImageProviderProps> = ({ children }) => {
  const [viewImage, setViewImage] = useState<ViewImageState>(null);

  return (
    <ViewImageContext.Provider value={viewImage}>
      <ViewImageSetterContext.Provider value={setViewImage}>
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
      </ViewImageSetterContext.Provider>
    </ViewImageContext.Provider>
  );
};
