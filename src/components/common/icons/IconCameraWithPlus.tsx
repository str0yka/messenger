import { forwardRef } from 'react';

export const IconCameraWithPlus = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
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
        d="M21 11v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.5a2 2 0 0 0 1.6-.8l1.05-1.4a2 2 0 0 1 1.6-.8h2.5M18.5 4v2.5m0 2.5V6.5m0 0H16m2.5 0H21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="13"
        r="4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);
