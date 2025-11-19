import React from "react";

const IslamabadIcon = ({ size = 80, className = "" }) => (
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

    {/* Rooftop tent shape */}
    <path
      d="M20 85 L60 25 L100 85 Z"
      stroke="url(#neonGrad)"
      strokeWidth="3"
      fill="none"
      filter="url(#glow)"
    />

    {/* Front triangle */}
    <path
      d="M40 85 L60 45 L80 85 Z"
      stroke="url(#neonGrad)"
      strokeWidth="3"
      fill="none"
      filter="url(#glow)"
    />

    {/* Minarets */}
    <path
      d="M20 20 L25 85"
      stroke="url(#neonGrad)"
      strokeWidth="3"
      filter="url(#glow)"
    />
    <path
      d="M100 20 L95 85"
      stroke="url(#neonGrad)"
      strokeWidth="3"
      filter="url(#glow)"
    />
  </svg>
);

export default IslamabadIcon;
