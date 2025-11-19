import React from "react";

const PeshawarIcon = ({ size = 80, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C6FB" />
        <stop offset="100%" stopColor="#00F7A1" />
      </linearGradient>

      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g stroke="url(#neonGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">

      {/* Left Tower */}
      <rect x="35" y="60" width="50" height="120" rx="4" />

      {/* Left Tower Brick Pattern */}
      <g strokeWidth="2">
        <line x1="50" y1="60" x2="50" y2="180" />
        <line x1="70" y1="60" x2="70" y2="180" />
        <line x1="35" y1="75" x2="85" y2="75" />
        <line x1="35" y1="95" x2="85" y2="95" />
        <line x1="35" y1="115" x2="85" y2="115" />
        <line x1="35" y1="135" x2="85" y2="135" />
        <line x1="35" y1="155" x2="85" y2="155" />
        <line x1="35" y1="175" x2="85" y2="175" />
      </g>

      {/* Left Tower Cap */}
      <rect x="45" y="50" width="30" height="12" rx="3" />

      {/* Right Tower */}
      <rect x="155" y="60" width="50" height="120" rx="4" />

      {/* Right Tower Brick Pattern */}
      <g strokeWidth="2">
        <line x1="170" y1="60" x2="170" y2="180" />
        <line x1="190" y1="60" x2="190" y2="180" />
        <line x1="155" y1="75" x2="205" y2="75" />
        <line x1="155" y1="95" x2="205" y2="95" />
        <line x1="155" y1="115" x2="205" y2="115" />
        <line x1="155" y1="135" x2="205" y2="135" />
        <line x1="155" y1="155" x2="205" y2="155" />
        <line x1="155" y1="175" x2="205" y2="175" />
      </g>

      {/* Right Tower Cap */}
      <rect x="165" y="50" width="30" height="12" rx="3" />

      {/* Bridge Wall */}
      <rect x="85" y="80" width="70" height="20" rx="4" />

      {/* Bridge Bricks */}
      <g strokeWidth="2">
        <line x1="95" y1="80" x2="95" y2="100" />
        <line x1="115" y1="80" x2="115" y2="100" />
        <line x1="135" y1="80" x2="135" y2="100" />
        <line x1="155" y1="80" x2="155" y2="100" />
        <line x1="85" y1="90" x2="155" y2="90" />
      </g>

      {/* Arch (Double Layer for Depth) */}
      <path d="M85 140 Q120 95 155 140" fill="none" />
      <path d="M92 140 Q120 105 148 140" fill="none" strokeWidth="3" />

      {/* Arch Plaque */}
      <rect x="108" y="120" width="25" height="12" rx="2" strokeWidth="2" />

      {/* Base Platform */}
      <rect x="30" y="180" width="180" height="12" rx="3" />

    </g>
  </svg>
);

export default PeshawarIcon;
