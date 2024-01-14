import { forwardRef } from 'react';

export const IconExclamationPoint = forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', ...props }, forwardedRef) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      height="20px"
      width="20px"
      viewBox="0 0 512 512"
      {...props}
      ref={forwardedRef}
    >
      <g>
        <path
          fill={color}
          d="M238.301,346.393c0.598,3.938,2.563,7.725,5.903,11.359c3.313,3.626,7.252,5.447,11.796,5.447   c10.592,0,16.486-5.608,17.691-16.806l35.398-271.98c0.607-4.823,0.911-11.636,0.911-20.415c0-13.618-4.679-26.013-14.065-37.22   C286.558,5.59,273.244,0,255.999,0c-17.868,0-31.317,5.742-40.389,17.226c-9.073,11.206-13.61,23.459-13.61,36.773   c0,8.172,0.285,14.976,0.892,20.415L238.301,346.393z"
        />
        <path
          fill={color}
          d="M295.033,418.065c-10.288-10.287-23.307-15.44-39.034-15.44c-15.422,0-28.441,5.314-39.032,15.896   c-10.591,10.591-15.877,23.441-15.877,38.569c0,14.52,5.286,27.379,15.877,38.577C227.558,506.562,240.578,512,255.999,512   c15.423,0,28.424-5.286,39.034-15.886c10.574-10.574,15.877-23.593,15.877-39.024C310.91,441.658,305.607,428.656,295.033,418.065z"
        />
      </g>
    </svg>
  ),
);
