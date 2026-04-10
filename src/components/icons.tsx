import type * as React from 'react';

export const MZtvLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    src="/logo.svg"
    alt="Narhan TV"
    {...props}
    className='h-10 w-auto'
  />
);
