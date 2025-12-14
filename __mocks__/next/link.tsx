import React from 'react';

const NextLink = ({ children, href, ...props }: any) => {
  return (
    <a href={href} data-testid="next-link" {...props}>
      {children}
    </a>
  );
};

export default NextLink;