"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, Truck } from "lucide-react";

interface SuccessProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessRitual({ isOpen, onClose }: SuccessProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-bg flex items-center justify-center p-6 text-center"
        >
          {/* Efecto de luz de fondo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

          <motion.div 
            initial={{ scale: 0.85, y: 30, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="max-w-md space-y-12 relative z-10"
          >
            {/* Icono de Éxito Cinematográfico */}
            <div className="relative inline-block">
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-accent rounded-full blur-3xl"
              />
              <div className="relative z-10 h-28 w-28 bg-bg border border-accent/30 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                <CheckCircle2 className="h-14 w-14 text-accent drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
              </div>
            </div>
            
            {/* Mensaje de Confirmación Automática */}
            <div className="space-y-6">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-serif text-white tracking-tighter leading-none"
              >
                ¡Orden <br /> Confirmada!
              </motion.h2>
              
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-[1px] bg-accent/40 mx-auto" 
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <p className="text-white font-bold text-sm tracking-[0.2em] uppercase">
                  El rastro ya es tuyo
                </p>
                <p className="text-muted text-sm tracking-widest leading-loose uppercase">
                  Hemos registrado tus datos de envío. <br />
                  <span className="text-accent/80 font-bold">Tu pedido entrará en despacho</span> <br />
                  en las próximas 12 horas. Recibirás tu guía <br />
                  por mensaje de texto.
                </p>
              </motion.div>
            </div>

            {/* Acción de Cierre */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              <button 
                onClick={onClose}
                className="w-full bg-accent text-bg font-black py-6 rounded-full text-[11px] tracking-[0.5em] uppercase hover:shadow-[0_25px_50px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all"
              >
                Volver a la Galería
              </button>
              
              <div className="flex items-center justify-center gap-3 opacity-30">
                <Truck className="h-3 w-3 text-accent" />
                <span className="text-[9px] tracking-[0.4em] uppercase font-bold">Envío Express Ecuador Activado</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
