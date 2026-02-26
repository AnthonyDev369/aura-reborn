"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface SocialProofToastProps {
  showToast: boolean;
  randomCity: string;
  onClose: () => void;
}

export default function SocialProofToast({ showToast, randomCity, onClose }: SocialProofToastProps) {
  return (
    <AnimatePresence>
      {showToast && (
        <motion.div 
          initial={{ y: 100, opacity: 0, scale: 0.9 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }} 
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-8 left-8 z-[300] w-80"
        >
          <div className="bg-gradient-to-br from-white via-white to-bg backdrop-blur-xl rounded-2xl border border-glassBorder shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden">
            
            {/* Body Principal */}
            <div className="px-6 py-5 relative">
              {/* Marca de agua griega */}
              <div className="absolute top-2 right-4 text-[80px] text-text/[0.02] font-serif leading-none pointer-events-none">
                Ὀ
              </div>
              
              {/* Contenido */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  {/* Barra decorativa */}
                  <div className="h-1 w-10 bg-text rounded-full mb-3" />
                  
                  {/* Título IMPACTANTE */}
                  <p className="text-text font-sans text-sm font-black uppercase tracking-[0.15em] mb-2 leading-none">
                    VENDIDO
                  </p>
                  
                  {/* Info secundaria */}
                  <p className="text-muted text-xs tracking-wide">
                    {randomCity} • Hace 2 min
                  </p>
                </div>
                
                <button 
                  onClick={onClose} 
                  className="text-muted hover:text-text transition-colors ml-4"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
