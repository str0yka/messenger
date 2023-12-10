/* eslint-disable react/destructuring-assignment */
import cn from 'classnames';

export const IconCheckCircled: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20px"
    height="20px"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
    className={cn('aspect-square h-auto w-full', props.className)}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3 10a7 7 0 019.307-6.611 1 1 0 00.658-1.889 9 9 0 105.98 7.501 1 1 0 00-1.988.22A7 7 0 113 10zm14.75-5.338a1 1 0 00-1.5-1.324l-6.435 7.28-3.183-2.593a1 1 0 00-1.264 1.55l3.929 3.2a1 1 0 001.38-.113l7.072-8z"
    />
  </svg>
);
