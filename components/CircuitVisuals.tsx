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

export const Battery: React.FC<{ x: number; y: number; voltage: number }> = ({ x, y, voltage }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Wire connection points */}
    <line x1="0" y1="-20" x2="0" y2="-10" stroke="#94a3b8" strokeWidth="4" />
    <line x1="0" y1="10" x2="0" y2="20" stroke="#94a3b8" strokeWidth="4" />
    
    {/* Battery body */}
    <rect x="-15" y="-10" width="30" height="20" fill="#334155" rx="2" />
    <text x="20" y="5" fill="#facc15" fontSize="12" fontWeight="bold">{voltage}V</text>
    
    {/* Terminals */}
    <line x1="-10" y1="-10" x2="10" y2="-10" stroke="#ef4444" strokeWidth="4" /> {/* Positive */}
    <line x1="-10" y1="10" x2="10" y2="10" stroke="#3b82f6" strokeWidth="4" /> {/* Negative */}
    
    <text x="-25" y="-5" fill="#ef4444" fontSize="14" fontWeight="bold">+</text>
    <text x="-25" y="15" fill="#3b82f6" fontSize="14" fontWeight="bold">-</text>
  </g>
);

export const Bulb: React.FC<{ x: number; y: number; power: number; label: string }> = ({ x, y, power, label }) => {
  // Calculate brightness opacity based on power (max assumed around 100W for demo scaling)
  const brightness = Math.min(power / 10, 1); 
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text x="-30" y="-35" fill="#94a3b8" fontSize="12">{label}</text>
      
      {/* Glow effect */}
      <circle cx="0" cy="0" r="25" fill={`rgba(250, 204, 21, ${brightness * 0.8})`} filter="blur(8px)" />
      
      {/* Glass bulb */}
      <circle cx="0" cy="0" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
      <circle cx="0" cy="0" r="15" fill={`rgba(250, 204, 21, ${brightness})`} />
      
      {/* Filament */}
      <path d="M-5 10 C-5 0, 5 0, 5 10" stroke="#475569" fill="none" strokeWidth="2" />
    </g>
  );
};

export const Switch: React.FC<{ x: number; y: number; isOpen: boolean; toggle: () => void }> = ({ x, y, isOpen, toggle }) => (
  <g transform={`translate(${x}, ${y})`} onClick={toggle} className="cursor-pointer hover:opacity-80">
    <text x="-15" y="-25" fill="#94a3b8" fontSize="12">Switch</text>
    <circle cx="-20" cy="0" r="4" fill="#94a3b8" />
    <circle cx="20" cy="0" r="4" fill="#94a3b8" />
    
    {/* Lever */}
    <line 
      x1="-20" 
      y1="0" 
      x2="20" 
      y2="0" 
      stroke="#ef4444" 
      strokeWidth="4" 
      transform={isOpen ? "rotate(-30, -20, 0)" : "rotate(0, -20, 0)"}
      className="transition-transform duration-300"
    />
  </g>
);

interface ElectronPathProps {
  path: string;
  current: number; // determines speed
}

export const ElectronPath: React.FC<ElectronPathProps> = ({ path, current }) => {
  if (current <= 0) {
    return <path d={path} stroke="#334155" strokeWidth="4" fill="none" />;
  }
  
  // Animation duration inversely proportional to current
  // Avoid division by zero or extremely fast speeds
  const duration = Math.max(0.2, 2 / (current + 0.1));

  return (
    <>
      {/* Base wire */}
      <path d={path} stroke="#475569" strokeWidth="4" fill="none" />
      {/* Moving electrons */}
      <path 
        d={path} 
        stroke="#38bdf8" 
        strokeWidth="4" 
        fill="none" 
        strokeDasharray="10 20" 
        className="animate-flow"
        style={{ animationDuration: `${duration}s` }}
      />
    </>
  );
};
