import React from 'react';

const InsightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15.09 16.05a1 1 0 0 1-1.42 1.42l-1.4-1.4a1 1 0 0 1 .7-.7l1.42-1.42a1 1 0 0 1 1.41 1.41l-1.4 1.4Z" />
    <path d="M12 21a7 7 0 1 1 4-12.25" />
    <path d="M12 10V3" />
    <path d="M12 21v-1" />
  </svg>
);

export default InsightIcon;
