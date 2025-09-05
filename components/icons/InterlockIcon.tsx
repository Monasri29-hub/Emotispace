import React from 'react';

const InterlockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M8.5 10.5c.83-1.17 2.17-2 3.5-2s2.67.83 3.5 2" />
    <path d="M8.5 13.5c.83 1.17 2.17 2 3.5 2s2.67-.83 3.5-2" />
    <path d="M15.5 12c1.17-.83 2-2.17 2-3.5s-.83-2.67-2-3.5" />
    <path d="M8.5 12c-1.17-.83-2-2.17-2-3.5S7.33 5.83 8.5 5" />
    <path d="M15.5 12c1.17.83 2 2.17 2 3.5s-.83 2.67-2 3.5" />
    <path d="M8.5 12c-1.17.83-2 2.17-2 3.5s.83 2.67 2 3.5" />
  </svg>
);

export default InterlockIcon;
