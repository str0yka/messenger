import { forwardRef } from 'react';

export const IconPushPin = forwardRef<SVGSVGElement, IconProps>(
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
        d="M8.847 5H8a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2h-.847l.714 4.995c.36.204.7.438 1.016.701C18.209 11.802 19 13.344 19 15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1c0-1.656.79-3.198 2.117-4.304a6.9 6.9 0 0 1 1.016-.7L8.847 5Zm2.02 0-.826 5.787a1 1 0 0 1-.565.764 5.02 5.02 0 0 0-1.078.682c-.613.51-1.028 1.122-1.237 1.767h9.679c-.21-.645-.625-1.257-1.238-1.767a5.022 5.022 0 0 0-1.078-.682 1 1 0 0 1-.565-.764L13.133 5h-2.266Z"
        fill={color}
      />
      <path
        d="M12 15v5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);
