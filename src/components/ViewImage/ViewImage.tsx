import cn from 'classnames';
import { forwardRef } from 'react';

import { useViewImage } from '~/utils/contexts';

export const ViewImage = forwardRef<React.ElementRef<'img'>, React.ComponentPropsWithoutRef<'img'>>(
  ({ src, alt, className, ...props }, ref) => {
    const { setViewImage } = useViewImage();

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
