import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Image, Compass, HelpCircle } from 'lucide-react';
import { TapeStyle } from '../types';

interface ExtraTape {
  id: string;
  x: number;
  y: number;
  rotation: number;
  style: TapeStyle;
}

interface BackgroundWallProps {
  children: React.ReactNode;
  tapeStyle: TapeStyle;
  wallType: 'plaster' | 'wood' | 'minimal';
  setWallType: (type: 'plaster' | 'wood' | 'minimal') => void;
  isEmbed?: boolean;
}

export const BackgroundWall: React.FC<BackgroundWallProps> = ({
  children,
  tapeStyle,
  wallType,
  setWallType,
  isEmbed = false,
}) => {
  const [extraTapes, setExtraTapes] = useState<ExtraTape[]>([]);

  // Enable sticking extra piece of Scotch tape anywhere on the wall
  const handleWallClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking directly on the wall backdrop, stick a piece of tape!
    if (e.target === e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newTape: ExtraTape = {
        id: crypto.randomUUID(),
        x,
        y,
        rotation: Math.floor(Math.random() * 80) - 40, // random -40 to 40deg
        style: tapeStyle,
      };

      setExtraTapes((prev) => [...prev, newTape]);
    }
  };

  const clearExtraTapes = () => {
    setExtraTapes([]);
  };

  const getWallClass = () => {
    switch (wallType) {
      case 'plaster':
        return 'bg-wall-plaster border-stone-300 border-0';
      case 'wood':
        // Reduce wooden frame thickness if embedded to match tightly
        if (isEmbed) {
          return 'bg-desk-warm border-stone-800 border-4 border-[#2a1b12]';
        }
        return 'bg-desk-warm border-stone-800 border-[16px] sm:border-[32px] md:border-[40px] border-[#2a1b12]';
      default:
        return 'bg-slate-50 border-0';
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between overflow-x-hidden transition-all duration-500 ease-in-out select-none ${
        isEmbed ? 'w-full h-full min-h-0 py-2 px-1' : 'min-h-screen py-6 px-4'
      } ${getWallClass()}`}
      onClick={handleWallClick}
    >
      {/* Organic foliage shadow overlay cast on the wall */}
      {wallType === 'plaster' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.06] bg-no-repeat bg-cover bg-center select-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200')",
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Decorative Warm Ambient Light Cast */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-amber-100/10 blur-[130px] rounded-full pointer-events-none" />

      {/* SPAWNED EXTRA TAPES ON CLICK */}
      {extraTapes.map((t) => (
        <motion.div
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          key={t.id}
          className="absolute pointer-events-auto cursor-pointer"
          style={{
            left: t.x - 64, // Center tape under click coordinate
            top: t.y - 16,
            zIndex: 10,
          }}
          onClick={(e) => {
            e.stopPropagation();
            // click tape to remove/peel it
            setExtraTapes((prev) => prev.filter((item) => item.id !== t.id));
          }}
          title="Fai click per staccare questo scotch"
        >
          {/* Using custom Tape styling matching our layout */}
          <div
            className={`tape-ripped-x w-32 h-8 shadow-sm ${
              t.style === 'transparent'
                ? 'bg-white/10 border border-white/5 backdrop-blur-[1.5px]'
                : t.style === 'yellow'
                ? 'bg-amber-300/35 border border-amber-400/10 backdrop-blur-[1px]'
                : t.style === 'washi-dots'
                ? 'bg-rose-100/90'
                : t.style === 'washi-stripes'
                ? 'bg-sky-100/95'
                : 'bg-teal-100/95'
            }`}
            style={{
              transform: `rotate(${t.rotation}deg)`,
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:4px_4px]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
            
            {t.style === 'washi-dots' && (
              <div className="absolute inset-0 flex items-center justify-around opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400/50" />
              </div>
            )}
            {t.style === 'washi-stripes' && (
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#0284c7,#0284c7_4px,transparent_4px,transparent_8px)]" />
            )}
          </div>
        </motion.div>
      ))}

      {/* HEADER BAR: Elegant and lightweight */}
      {!isEmbed && (
        <header className="max-w-md mx-auto w-full z-10 flex items-center justify-between py-2 text-stone-500/80 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-black tracking-widest text-xs uppercase text-stone-700/80">FOgLIO STRApPaTO</span>
          </div>
          
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Background wall type toggle buttons */}
            {(['plaster', 'wood', 'minimal'] as const).map((wt) => (
              <button
                key={wt}
                onClick={() => setWallType(wt)}
                className={`p-1 rounded text-[10px] uppercase font-bold tracking-tight cursor-pointer transition-all ${
                  wallType === wt
                    ? 'bg-stone-800 text-stone-100 shadow-sm'
                    : 'text-stone-400 hover:text-stone-600 bg-stone-200/40 hover:bg-stone-200/60'
                }`}
                title={`Sfondo: ${wt}`}
              >
                {wt === 'plaster' ? 'Muro' : wt === 'wood' ? 'Legno' : 'Flat'}
              </button>
            ))}
          </div>
        </header>
      )}

      {/* CORE FRAME FOR TORN CALENDAR */}
      <main className={`flex-1 flex flex-col items-center justify-center relative ${isEmbed ? 'my-0 py-1' : 'my-4'}`}>
        {children}
      </main>

      {/* FOOTER BAR: Simple contextual helper card explaining interactive taping */}
      {!isEmbed && (
        <footer className="max-w-md mx-auto w-full z-30 pointer-events-auto mt-4 text-center">
          <div className="inline-flex flex-col items-center gap-1.5 bg-white/70 backdrop-blur-xs border border-stone-200/50 rounded-full px-5 py-2.5 shadow-xs text-[11px] text-stone-500">
            <p className="font-medium">
              💡 <span className="font-semibold text-stone-700">Fai click sullo sfondo</span> per incollare pezzetti di scotch extra!
            </p>
            {extraTapes.length > 0 && (
              <button
                onClick={clearExtraTapes}
                className="text-red-500 hover:text-red-600 font-bold underline text-[10px] cursor-pointer"
              >
                Rimuovi tutto lo scotch aggiuntivo ({extraTapes.length})
              </button>
            )}
          </div>
          
          <div className="mt-4 text-center text-amber-900/60 font-serif italic select-none">
            <p className="text-sm">"Ogni giorno è un foglio bianco, o quasi."</p>
          </div>
          
          <div className="mt-3 text-[9px] text-stone-400 uppercase tracking-widest pointer-events-none">
            100% Client-Side • Nessun tracciamento • Realizzato con cura
          </div>
        </footer>
      )}
    </div>
  );
};
