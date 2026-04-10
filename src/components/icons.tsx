import type * as React from 'react';

export const MZtvLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    src="/logo.png"
    alt="MZtv Logo"
    {...props}
    className='h-12 w-auto'
  />
);