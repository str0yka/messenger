import { forwardRef } from 'react';

export const IconOpenLock = forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ color = 'currentColor', ...props }, forwardedRef) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      ref={forwardedRef}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5C10.3431 5 9 6.34315 9 8V11H16C17.6569 11 19 12.3431 19 14V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V14C5 12.6938 5.83481 11.5825 7 11.1707V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V8.1C17 8.65228 16.5523 9.1 16 9.1C15.4477 9.1 15 8.65228 15 8.1V8C15 6.34315 13.6569 5 12 5ZM8 13C7.44772 13 7 13.4477 7 14V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V14C17 13.4477 16.5523 13 16 13H8Z"
        fill={color}
      />
    </svg>
  ),
);
