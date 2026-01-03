import React from 'react';

// Common SVG props
interface CircuitSVGProps {
  current: number; // For animation speed
  voltage: number; // For brightness
  resistance: number; 
  isActive: boolean;
  type: 'bulb' | 'resistor' | 'battery' | 'switch';
  label?: string;
  x: number;
  y: number;
}

// Shared Definitions for Filters (Glows, Shadows)
export const CircuitDefs: React.FC = () => (
  <defs>
    <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="battery-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#334155" />
      <stop offset="100%" stopColor="#1e293b" />
    </linearGradient>
    <linearGradient id="tech-metal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#475569" />
      <stop offset="100%" stopColor="#1e293b" />
    </linearGradient>
  </defs>
);

export const Battery: React.FC<{ x: number; y: number; voltage: number }> = ({ x, y, voltage }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Connection wires */}
    <line x1="0" y1="-25" x2="0" y2="-12" stroke="#64748b" strokeWidth="4" />
    <line x1="0" y1="12" x2="0" y2="25" stroke="#64748b" strokeWidth="4" />
    
    {/* Battery body container */}
    <rect x="-18" y="-12" width="36" height="24" fill="url(#battery-grad)" stroke="#64748b" strokeWidth="2" rx="2" />
    
    {/* Voltage Text */}
    <text x="24" y="5" fill="#fbbf24" fontSize="12" fontWeight="bold" fontFamily="monospace" style={{textShadow: '0 0 5px rgba(251, 191, 36, 0.5)'}}>
      {voltage}V
    </text>
    
    {/* Polarity Markers */}
    <text x="-32" y="-5" fill="#ef4444" fontSize="14" fontWeight="bold">+</text>
    <text x="-32" y="15" fill="#3b82f6" fontSize="14" fontWeight="bold">-</text>

    {/* Internal stylized plates */}
    <line x1="-12" y1="-12" x2="12" y2="-12" stroke="#ef4444" strokeWidth="3" />
    <line x1="-12" y1="12" x2="12" y2="12" stroke="#3b82f6" strokeWidth="3" />
  </g>
);

export const Bulb: React.FC<{ x: number; y: number; power: number; label: string }> = ({ x, y, power, label }) => {
  const brightness = Math.min(power / 10, 1); 
  const glowColor = `rgba(250, 204, 21, ${brightness})`;
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text x="-30" y="-35" fill="#94a3b8" fontSize="10" fontFamily="monospace" className="uppercase tracking-wider">{label}</text>
      
      {/* Outer Glow Halo */}
      <circle cx="0" cy="0" r="28" fill={glowColor} filter="blur(12px)" opacity={brightness * 0.8} />
      
      {/* Base/Socket */}
      <rect x="-6" y="12" width="12" height="8" fill="#475569" rx="1" />
      
      {/* Glass bulb */}
      <circle cx="0" cy="0" r="16" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" fillOpacity="0.1" />
      
      {/* Lit Core */}
      <circle cx="0" cy="0" r="14" fill={glowColor} opacity={brightness} filter="url(#glow-yellow)" />
      
      {/* Filament structure */}
      <path d="M-4 12 L-4 0 M 4 12 L 4 0" stroke="#475569" strokeWidth="1" />
      <path d="M-4 0 Q 0 -5, 4 0" stroke={brightness > 0.1 ? "#fff" : "#475569"} strokeWidth="1.5" fill="none" />
    </g>
  );
};

export const Switch: React.FC<{ x: number; y: number; isOpen: boolean; toggle: () => void }> = ({ x, y, isOpen, toggle }) => (
  <g transform={`translate(${x}, ${y})`} onClick={toggle} className="cursor-pointer group">
    {/* Label */}
    <text x="0" y="-25" textAnchor="middle" fill="#94a3b8" fontSize="10" className="uppercase tracking-widest font-mono">
      {isOpen ? 'OFF' : 'ON'}
    </text>
    
    {/* Wire connection points */}
    {/* Ensure visual continuity with the main circuit wire */}
    <line x1="-30" y1="0" x2="-24" y2="0" stroke="#64748b" strokeWidth="4" />
    <line x1="24" y1="0" x2="30" y2="0" stroke="#64748b" strokeWidth="4" />

    {/* Switch Housing / Track */}
    <rect 
      x="-24" 
      y="-10" 
      width="48" 
      height="20" 
      rx="10" 
      fill="#0f172a" 
      stroke={!isOpen ? "#06b6d4" : "#475569"} 
      strokeWidth="2" 
      className="transition-colors duration-300"
      filter={!isOpen ? "url(#glow-cyan)" : ""}
    />
    
    {/* Sliding Knob (Toggle) */}
    {/* If isOpen is TRUE, circuit is BROKEN (OFF state in physics terms usually, but visually toggle OFF) */}
    {/* Let's align visual state: Left = OFF (Open), Right = ON (Closed) */}
    {/* In physics: Open Switch = No Current. Closed Switch = Current. */}
    {/* UI: Open (Off) -> Knob Left. Closed (On) -> Knob Right. */}
    
    <circle 
      cx={isOpen ? "-12" : "12"} 
      cy="0" 
      r="6" 
      fill={!isOpen ? "#22d3ee" : "#64748b"}
      className="transition-all duration-300 ease-in-out"
    />

    {/* Tech accents on housing */}
    {isOpen && (
       <path d="M -5 -4 L 5 4 M -5 4 L 5 -4" stroke="#334155" strokeWidth="1.5" transform="translate(-12, 0) scale(0.6)" />
    )}
    {!isOpen && (
       <circle cx="12" cy="0" r="2" fill="#fff" opacity="0.8" />
    )}

  </g>
);

interface ElectronPathProps {
  path: string;
  current: number; // determines speed
}

export const ElectronPath: React.FC<ElectronPathProps> = ({ path, current }) => {
  // If no current, just show the dark wire
  if (current <= 0) {
    return <path d={path} stroke="#1e293b" strokeWidth="3" fill="none" />;
  }
  
  // Animation duration inversely proportional to current
  const duration = Math.max(0.2, 2 / (current + 0.1));

  return (
    <>
      {/* Base Wire - Darker Tech Blue */}
      <path d={path} stroke="#1e293b" strokeWidth="4" fill="none" />
      
      {/* Inner Glow Line */}
      <path d={path} stroke="#0e7490" strokeWidth="2" fill="none" opacity="0.5" />

      {/* Moving Electrons / Energy Packets */}
      <path 
        d={path} 
        stroke="#22d3ee" 
        strokeWidth="3" 
        fill="none" 
        strokeDasharray="4 20" 
        strokeLinecap="round"
        className="animate-flow"
        style={{ animationDuration: `${duration}s` }}
        filter="url(#glow-cyan)"
      />
    </>
  );
};
