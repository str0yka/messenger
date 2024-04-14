import { forwardRef } from 'react';

export const IconReply = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ color = 'currentColor', ...props }, forwardedRef) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="-0.5 0 28 28"
      {...props}
      ref={forwardedRef}
    >
      <path
        d="M13 15c-.654 0-3.02.02-3.02.02v5.37L2.323 12 9.98 3.6v5.41S12.48 8.98 13 9c7.062.22 11.966 8.26 11.998 12.02C22.84 18.25 17.17 15 13 15Zm-1.017-7.99v-5.9a.992.992 0 0 0-.275-.83 1.025 1.025 0 0 0-1.434 0L.285 11.24a.98.98 0 0 0-.287.76c-.014.27.076.55.287.76l9.934 10.89a.97.97 0 0 0 1.481.07c.002 0 .006 0 .008-.01a.972.972 0 0 0 .275-.82L12 17c6.6 0 12.569 4.75 13.754 11.01A15.003 15.003 0 0 0 27 22.02c0-8.29-6.724-15.01-15.017-15.01Z"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  ),
);
