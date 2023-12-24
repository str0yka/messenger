/* eslint-disable react/destructuring-assignment */
import cn from 'classnames';

export const IconDoubleCheck: React.FC<IconProps> = (props) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width="20px"
      height="20px"
      {...props}
      className={cn('aspect-square h-auto w-full', props.className)}
    >
      <path
        d="M2 12L7.25 17C7.25 17 8.66939 15.3778 9.875 14"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12L13.25 17L22 7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 7L12.5 11"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </>
);
