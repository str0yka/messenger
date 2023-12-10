/* eslint-disable react/destructuring-assignment */
import cn from 'classnames';

export const IconCheck: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20px"
    height="20px"
    viewBox="0 -0.5 25 25"
    fill="none"
    {...props}
    className={cn('aspect-square h-auto w-full', props.className)}
  >
    <path
      d="M5.5 12.5L10.167 17L19.5 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
