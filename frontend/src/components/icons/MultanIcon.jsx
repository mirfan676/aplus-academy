import React from "react";

const MultanIcon = ({ size = 80, className = "" }) => (
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

    {/* Dome */}
    <path
      d="M40 55 Q60 25 80 55"
      stroke="url(#neonGrad)"
      strokeWidth="3"
      fill="none"
      filter="url(#glow)"
    />

    {/* Dome base */}
    <path
      d="M35 55 L85 55"
      stroke="url(#neonGrad)"
      strokeWidth="3"
      fill="none"
      filter="url(#glow)"
    />

    {/* Octagon body */}
    <path
      d="M35 55 L30 75 L40 95 L60 105 L80 95 L90 75 L85 55 Z"
      stroke="url(#neonGrad)"
      strokeWidth="3"
      strokeLinejoin="round"
      fill="none"
      filter="url(#glow)"
    />

    {/* Entrance arch */}
    <path
      d="M53 105 L53 85 Q60 78 67 85 L67 105"
      stroke="url(#neonGrad)"
      strokeWidth="3"
      fill="none"
      filter="url(#glow)"
    />
  </svg>
);

export default MultanIcon;
