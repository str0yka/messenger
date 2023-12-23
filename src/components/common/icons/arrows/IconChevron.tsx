import cn from 'classnames';

interface IconChevronProps extends IconProps {
  direction?: 'left' | 'right' | 'down' | 'up';
}

export const IconChevron: React.FC<IconChevronProps> = ({ direction = 'left', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
    className={cn(
      'aspect-square h-auto w-full',
      {
        transform: direction !== 'left',
        'rotate-90': direction === 'up',
        'rotate-180': direction === 'right',
        '-rotate-90': direction === 'down',
      },
      props.className,
    )}
  >
    <path
      d="M15 7L10 12L15 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
