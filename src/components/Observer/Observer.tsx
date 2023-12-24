import { useEffect, useRef } from 'react';

import { useIntersectionObserver } from '~/utils/hooks';

interface ObserverProps extends React.ComponentProps<'div'> {
  observe: (entry: IntersectionObserverEntry | undefined) => void;
  observerParams?: IntersectionObserverInit;
  children?: React.ReactNode;
}

export const Observer: React.FC<ObserverProps> = ({
  observe,
  observerParams = {},
  children,
  ...props
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(observerRef, observerParams);

  useEffect(() => {
    observe(entry);
  }, [entry]);

  return (
    <div
      ref={observerRef}
      {...props}
    >
      {children}
    </div>
  );
};
