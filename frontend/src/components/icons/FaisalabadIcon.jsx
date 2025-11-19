import React from "react";

const FaisalabadIcon = ({ size = 80, className = "" }) => (
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
        M50 20 L70 20 
        L75 40 L45 40 Z

        M48 40 L72 40 
        L72 75 L48 75 Z

        M55 55 
        L55 50 
        L65 50 
        L65 55 Z

        M45 75 
        L75 75 
        L80 100 
        L40 100 Z
      "
      stroke="url(#neonGrad)"
      strokeWidth="3"
      fill="none"
      filter="url(#glow)"
      strokeLinejoin="round"
    />
  </svg>
);

export default FaisalabadIcon;
