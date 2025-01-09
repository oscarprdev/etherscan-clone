import { PropsWithChildren } from 'react';
import { Link as ReactLink } from 'react-router';

const Link = ({ to, children }: PropsWithChildren<{ to: string }>) => {
  return (
    <ReactLink to={to} className="text-link hover:text-link-hover">
      {children}
    </ReactLink>
  );
};

export default Link;
