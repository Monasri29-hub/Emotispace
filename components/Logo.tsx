import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="emotiSpaceArchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#475569" /> 
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>

    {/* The Resonant Wave (Emotion) */}
    <path
      d="M 20,78 C 40,68, 60,88, 80,78"
      fill="none"
      stroke="#E17C60" // Warm Terracotta/Coral
      strokeWidth="8"
      strokeLinecap="round"
    />
    
    {/* The Protective Arch (Structure) */}
    <path
      d="M 20,78 A 30 30 0 0 1 80 78"
      fill="none"
      stroke="url(#emotiSpaceArchGradient)" // Slate Gray Gradient
      strokeWidth="8"
      strokeLinecap="round"
    />
  </svg>
);

export default Logo;