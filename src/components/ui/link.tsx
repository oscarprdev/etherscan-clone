import { PropsWithChildren } from 'react';
import { Link as ReactLink } from 'react-router';
import { cn } from '~/lib/utils';

const Link = ({
  to,
  className,
  children,
}: PropsWithChildren<{ to: string; className?: string }>) => {
  return (
    <ReactLink to={to} className={cn(className, 'hover:text-accent-hover text-accent')}>
      {children}
    </ReactLink>
  );
};

export default Link;
