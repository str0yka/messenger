import { forwardRef } from 'react';

export const IconPapers = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ color = 'currentColor', ...props }, forwardedRef) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      ref={forwardedRef}
    >
      <path
        d="M3 16V4C3 2.89543 3.89543 2 5 2H15M9 22H18C19.1046 22 20 21.1046 20 20V8C20 6.89543 19.1046 6 18 6H9C7.89543 6 7 6.89543 7 8V20C7 21.1046 7.89543 22 9 22Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);
