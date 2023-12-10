import cn from 'classnames';
import { Link as LinkReactRouterDom } from 'react-router-dom';

interface LinkProps extends Props<typeof LinkReactRouterDom> {}

export const Link: React.FC<LinkProps> = ({ children, ...props }) => (
  <LinkReactRouterDom
    {...props}
    className={cn('text-primary-400', 'hover:underline', props.className)}
  >
    {children}
  </LinkReactRouterDom>
);
