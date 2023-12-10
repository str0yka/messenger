/* eslint-disable react/destructuring-assignment */
import cn from 'classnames';

export const IconHamburgerMenu: React.FC<IconProps> = (props) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={cn('aspect-square h-auto w-full', props.className)}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 7a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm1 4a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3z"
      fill="currentColor"
    />
  </svg>
);
