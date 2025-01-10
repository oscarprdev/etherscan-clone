import { PropsWithChildren } from 'react';
import { Link as ReactLink } from 'react-router';

const Link = ({ to, children }: PropsWithChildren<{ to: string }>) => {
  return (
    <ReactLink to={to} className="hover:text-accent-hover text-accent">
      {children}
    </ReactLink>
  );
};

export default Link;
