/* eslint-disable react/destructuring-assignment */
import cn from 'classnames';

export const IconInfoCircled: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
    className={cn('aspect-square h-auto w-full', props.className)}
  >
    <path
      d="M12 18.5C12.5523 18.5 13 18.0523 13 17.5L13 10.5C13 9.94772 12.5523 9.5 12 9.5C11.4477 9.5 11 9.94772 11 10.5L11 17.5C11 18.0523 11.4477 18.5 12 18.5Z"
      fill="currentColor"
    />
    <path
      d="M12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
      fill="currentColor"
    />
  </svg>
);
