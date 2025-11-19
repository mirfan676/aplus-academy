import React from "react";

const LahoreIcon = ({ size = 80, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00a6ff" />
        <stop offset="100%" stopColor="#00ff8f" />
      </linearGradient>

      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <path
      d="
        M60 10
        L55 25 L65 25
        L60 10 Z

        M48 25 L72 25 
        L76 40 L44 40 Z

        M50 40 L70 40 
        L73 65 L47 65 Z

        M45 65 L75 65 
        L80 95 L40 95 Z

        M35 95 L85 95 
        L95 110 L25 110 Z
      "
      stroke="url(#neonGrad)"
      strokeWidth="3"
      strokeLinejoin="round"
      fill="none"
      filter="url(#glow)"
    />
  </svg>
);

export default LahoreIcon;
