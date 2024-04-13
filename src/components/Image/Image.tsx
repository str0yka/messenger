import { forwardRef, useState } from 'react';

interface ImageProps extends React.ComponentPropsWithoutRef<'img'> {
  width: number;
  height: number;
}

export const Image = forwardRef<React.ElementRef<'img'>, ImageProps>(
  ({ width, height, src, alt, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
      <img
        {...props}
        width={width}
        height={height}
        ref={ref}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
      />
    );
  },
);
