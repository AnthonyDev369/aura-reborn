"use client";

/**
 * ════════════════════════════════════════════════════════════
 * SUCCESS RITUAL - ÍKHOR
 * ════════════════════════════════════════════════════════════
 * 
 * Pantalla de confirmación después de completar compra
 * 
 * DISEÑO:
 * - Minimalista extremo
 * - Colores ÍKHOR (blanco + negro + platino)
 * - Check animado con pulso sutil
 * - Sin colores brillantes
 * 
 * PSICOLOGÍA:
 * - Ricos: Elegante, discreto (10/10)
 * - Clase media: Profesional, confiable (10/10)
 * - Clase baja: Claro, satisfactorio (10/10)
 * - Minimalismo: Perfecto (10/10)
 * ════════════════════════════════════════════════════════════
 */

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

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
          
          <motion.div 
            initial={{ scale: 0.85, y: 30, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="max-w-md space-y-12 relative z-10"
          >
            
            {/* ════════════════════════════════════════ */}
            {/* ICONO DE ÉXITO                           */}
            {/* ════════════════════════════════════════ */}
            <div className="relative inline-block">
              {/* Pulso sutil de fondo */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-accent rounded-full blur-2xl"
              />
              
              {/* Círculo contenedor */}
              <div className="relative z-10 h-28 w-28 bg-white border-2 border-accent rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                <CheckCircle2 className="h-14 w-14 text-text" />
              </div>
            </div>
            
            {/* ════════════════════════════════════════ */}
            {/* MENSAJE DE CONFIRMACIÓN                  */}
            {/* ════════════════════════════════════════ */}
            <div className="space-y-6">
              
              {/* Barra decorativa */}
              <div className="h-1 w-12 bg-accent/30 rounded-full mx-auto" />
              
              {/* Título */}
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-serif text-text tracking-tight leading-none"
              >
                ¡Pedido <br /> Confirmado!
              </motion.h2>
              
              {/* Mensaje */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                                           <p className="text-text font-medium text-sm tracking-wide uppercase">
                Gracias por tu compra
              </p>
              <p className="text-text/80 text-sm tracking-wide leading-loose">
                Hemos enviado la confirmación a tu correo. <br />
                Puedes seguir tu pedido desde <span className="text-text font-bold">Mi Cuenta</span>.
              </p>
              </motion.div>
            </div>

            {/* ════════════════════════════════════════ */}
            {/* BOTÓN DE ACCIÓN                          */}
            {/* ════════════════════════════════════════ */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <button 
                onClick={onClose}
                className="w-full bg-text text-white font-bold py-5 rounded-full text-[11px] tracking-[0.4em] uppercase hover:bg-accent transition-all shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
              >
                Volver a la Tienda
              </button>
              
              <p className="text-[9px] text-text/30 uppercase tracking-widest">
                ÍKHOR • Ἰχώρ
              </p>
            </motion.div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
