import React from "react";

const RawalpindiIcon = ({ size = 80, className = "" }) => (
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
        M25 90 L25 40 
        L45 30 L75 30 
        L95 40 L95 90 
        M45 90 L45 60 
        Q60 45 75 60 
        L75 90
      "
      stroke="url(#neonGrad)"
      strokeWidth="3"
      fill="none"
      strokeLinejoin="round"
      filter="url(#glow)"
    />
  </svg>
);

export default RawalpindiIcon;
