import React from "react";

const QuettaIcon = ({ size = 80, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 260 260" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradQuetta" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C6FB"/>
        <stop offset="100%" stopColor="#00F7A1"/>
      </linearGradient>
    </defs>
    <g stroke="url(#gradQuetta)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">

      <path d="M20 155 Q70 115 120 140 Q170 115 220 150" strokeWidth="4" fill="none" opacity="0.55"/>
      <path d="M40 150 Q80 130 120 150 Q160 130 200 155" strokeWidth="3" fill="none" opacity="0.35"/>

      <path d="M60 75 L130 35 L200 75 Z" fill="none"/>
      <g strokeWidth="2">
        <line x1="72" y1="70" x2="188" y2="70"/>
        <line x1="80" y1="65" x2="180" y2="65"/>
        <line x1="88" y1="60" x2="172" y2="60"/>
        <line x1="96" y1="55" x2="164" y2="55"/>
        <line x1="104" y1="50" x2="156" y2="50"/>
      </g>

      <g strokeWidth="2">
        <line x1="130" y1="35" x2="130" y2="20"/>
        <rect x="130" y="20" width="14" height="10" fill="none"/>
        <circle cx="138" cy="25" r="3"/>
        <path d="M138 22 Q140 25 138 28"/>
      </g>

      <rect x="55" y="75" width="150" height="80" rx="6"/>
      <g strokeWidth="2">
        <line x1="70" y1="75" x2="70" y2="155"/>
        <line x1="90" y1="75" x2="90" y2="155"/>
        <line x1="110" y1="75" x2="110" y2="155"/>
        <line x1="130" y1="75" x2="130" y2="155"/>
        <line x1="150" y1="75" x2="150" y2="155"/>
        <line x1="170" y1="75" x2="170" y2="155"/>
      </g>
      <g strokeWidth="2" opacity="0.7">
        <line x1="55" y1="75" x2="85" y2="105"/>
        <line x1="205" y1="75" x2="175" y2="105"/>
      </g>

      <g strokeWidth="2">
        <line x1="55" y1="110" x2="205" y2="110"/>
        <line x1="55" y1="118" x2="205" y2="118"/>
        {[...Array(12)].map((_, i) => (
          <line key={i} x1={65+i*10} y1="110" x2={65+i*10} y2="118"/>
        ))}
      </g>

      <g strokeWidth="3">
        <rect x="120" y="125" width="25" height="30" rx="3"/>
        <rect x="80" y="125" width="22" height="20" rx="3"/>
        <line x1="91" y1="125" x2="91" y2="145"/>
        <rect x="160" y="125" width="22" height="20" rx="3"/>
        <line x1="171" y1="125" x2="171" y2="145"/>
      </g>

      <rect x="45" y="155" width="170" height="70" rx="6"/>
      <g strokeWidth="2" opacity="0.9">
        <line x1="45" y1="170" x2="215" y2="170"/>
        <line x1="45" y1="185" x2="215" y2="185"/>
        <line x1="45" y1="200" x2="215" y2="200"/>
        <line x1="55" y1="160" x2="75" y2="160"/>
        <line x1="90" y1="160" x2="110" y2="160"/>
        <line x1="125" y1="160" x2="145" y2="160"/>
        <line x1="160" y1="160" x2="180" y2="160"/>
        <line x1="65" y1="175" x2="85" y2="175"/>
        <line x1="100" y1="175" x2="120" y2="175"/>
        <line x1="135" y1="175" x2="155" y2="175"/>
        <line x1="170" y1="175" x2="190" y2="175"/>
      </g>

      <rect x="35" y="225" width="190" height="18" rx="5"/>
    </g>
  </svg>
);

export default QuettaIcon;
