import { forwardRef } from 'react';

export const IconCheck = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ color = 'currentColor', ...props }, forwardedRef) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="0 -0.5 25 25"
      fill="none"
      {...props}
      ref={forwardedRef}
    >
      <path
        d="M5.5 12.5L10.167 17L19.5 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);
