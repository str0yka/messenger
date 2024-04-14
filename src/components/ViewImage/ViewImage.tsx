import cn from 'classnames';
import { forwardRef } from 'react';

import { useViewImageSetter } from '~/utils/contexts';

export const ViewImage = forwardRef<React.ElementRef<'img'>, React.ComponentPropsWithoutRef<'img'>>(
  ({ src, alt, className, ...props }, ref) => {
    const setViewImage = useViewImageSetter();

    return (
      <img
        aria-hidden
        {...props}
        ref={ref}
        className={cn('cursor-pointer', className)}
        src={src}
        alt={alt}
        onClick={() => setViewImage(src)}
      />
    );
  },
);
