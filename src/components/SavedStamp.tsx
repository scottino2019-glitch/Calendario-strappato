import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SavedStampProps {
  trigger: boolean;
}

export const SavedStamp: React.FC<SavedStampProps> = ({ trigger }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000); // stamp stays visible for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 2.2, opacity: 0, rotate: 12 }}
          animate={{ 
            scale: 0.9, 
            opacity: 0.85, 
            rotate: -8,
            transition: { 
              type: 'spring', 
              damping: 12, 
              stiffness: 140 
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            transition: { duration: 0.4, ease: 'easeIn' } 
          }}
          className="absolute bottom-6 right-6 pointer-events-none select-none z-10"
        >
          {/* Distressed ink stamp container */}
          <div className="relative border-2 border-red-600/60 text-red-600/60 font-mono font-black text-[10px] tracking-widest px-2.5 py-1 uppercase rounded-sm border-dashed select-none flex flex-col items-center justify-center bg-transparent">
            {/* Ink bleed / grunge particles using radial gradients */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(rgba(220,38,38,0.3)_1px,transparent_1.5px)] bg-[size:3px_3px]" />
            
            <div className="font-bold flex items-center gap-1">
              <span>●</span>
              <span>SALVATO LOCALMENTE</span>
              <span>●</span>
            </div>
            
            <div className="text-[7px] font-medium opacity-75 mt-0.5 tracking-tight font-sans">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            
            {/* Distressed grunge overlays */}
            <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-amber-50/20 mix-blend-color-dodge" />
            <div className="absolute top-[40%] bottom-[40%] right-[10%] w-[3px] bg-amber-50/20 mix-blend-color-dodge" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
