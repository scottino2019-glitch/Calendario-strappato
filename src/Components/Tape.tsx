import React, { useState } from 'react';
import { TapeStyle } from '../types';

interface TapeProps {
  style: TapeStyle;
  rotation?: number; // degree
  className?: string;
  horizontal?: boolean;
}

export const Tape: React.FC<TapeProps> = ({
  style,
  rotation = -3,
  className = '',
  horizontal = true,
}) => {
  const [hovered, setHovered] = useState(false);
  const [shineX, setShineX] = useState(50); // percentage for light shine

  // Handle subtle visual shine reflection following mouse cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setShineX(x);
  };

  // Build style-specific background design
  const getTapeStyleClasses = () => {
    switch (style) {
      case 'transparent':
        return 'bg-white/10 border border-white/5 shadow-sm backdrop-blur-[1.5px]';
      case 'yellow':
        return 'bg-amber-300/35 border border-amber-400/10 shadow-sm backdrop-blur-[1px]';
      case 'washi-dots':
        return 'bg-rose-100/90 shadow-sm pattern-dots'; // Coral washi with dot pattern
      case 'washi-stripes':
        return 'bg-sky-100/90 shadow-sm pattern-stripes'; // Sky washi with striped pattern
      case 'green-deco':
        return 'bg-teal-100/95 shadow-sm pattern-grid-deco';
      default:
        return 'bg-white/15 backdrop-blur-[1px]';
    }
  };

  return (
    <div
      className={`absolute select-none group cursor-grab active:cursor-grabbing transition-transform duration-300 ${
        horizontal ? 'tape-ripped-x w-32 h-8' : 'tape-ripped-y w-8 h-32'
      } ${getTapeStyleClasses()} ${className}`}
      style={{
        transform: `rotate(${rotation}deg) scale(${hovered ? 1.02 : 1})`,
        zIndex: 40,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Tape internal adhesive bubbles / textured aging noise */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1.5px)] bg-[size:6px_6px] opacity-40 mix-blend-multiply" />

      {/* Specialty Washi patterns painted inside the tape */}
      {style === 'washi-dots' && (
        <div className="absolute inset-0 flex items-center justify-around opacity-60">
          <div className="w-2 h-2 rounded-full bg-rose-400/60" />
          <div className="w-2 h-2 rounded-full bg-rose-400/60" />
          <div className="w-2 h-2 rounded-full bg-rose-400/60" />
          <div className="w-2 h-2 rounded-full bg-rose-400/60" />
        </div>
      )}

      {style === 'washi-stripes' && (
        <div 
          className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#0284c7,#0284c7_4px,transparent_4px,transparent_12px)]"
        />
      )}

      {style === 'green-deco' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
          <div className="border border-dashed border-emerald-600/30 w-full h-1/2" />
        </div>
      )}

      {/* Adhesive border dust (slight darker outline around ripped tape ends) */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-black/10 mix-blend-multiply" />
      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-black/10 mix-blend-multiply" />

      {/* Realistic diagonal glossy highlight that shifts on hover / mouse move */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(115deg, 
            transparent ${shineX - 25}%, 
            rgba(255,255,255,${style === 'transparent' ? 0.35 : 0.25}) ${shineX - 5}%, 
            rgba(255,255,255,${style === 'transparent' ? 0.65 : 0.45}) ${shineX}%, 
            rgba(255,255,255,${style === 'transparent' ? 0.35 : 0.25}) ${shineX + 5}%, 
            transparent ${shineX + 25}%)`,
          opacity: hovered ? 1 : 0.7,
        }}
      />

      {/* Small crumpled plastic vein line for added depth */}
      <div className="absolute top-[15%] left-[10%] right-[15%] h-[1px] bg-white/25 pointer-events-none" />
      <div className="absolute bottom-[20%] left-[30%] right-[5%] h-[1px] bg-white/15 pointer-events-none" />
    </div>
  );
};
