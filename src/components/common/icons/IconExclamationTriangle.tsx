import { forwardRef } from 'react';

export const IconExclamationTriangle = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.7525 2.11124C12.9926 0.729683 11.0075 0.729688 10.2476 2.11124L0.938894 19.0362C0.205794 20.3691 1.17012 22 2.69133 22H21.3088C22.83 22 23.7943 20.3691 23.0612 19.0362L13.7525 2.11124ZM12.0001 3.07507L21.3088 20L2.69133 20L12.0001 3.07507ZM12.0001 8.00004C12.5523 8.00004 13.0001 8.44775 13.0001 9.00004V14C13.0001 14.5523 12.5523 15 12.0001 15C11.4478 15 11.0001 14.5523 11.0001 14V9.00004C11.0001 8.44775 11.4478 8.00004 12.0001 8.00004ZM13.2501 17.75C13.2501 18.4404 12.6904 19 12.0001 19C11.3097 19 10.7501 18.4404 10.7501 17.75C10.7501 17.0597 11.3097 16.5 12.0001 16.5C12.6904 16.5 13.2501 17.0597 13.2501 17.75Z"
        fill={color}
      />
    </svg>
  ),
);
