"use client";
import { motion } from "framer-motion";
import { ShoppingBag, User } from "lucide-react";
import Link from "next/link";

/**
 * ════════════════════════════════════════════════════════════
 * NAVBAR - ÍKHOR
 * ════════════════════════════════════════════════════════════
 * 
 * Navegación minimalista obsesiva estilo Apple
 * 
 * COMPONENTES:
 * - Logo ÍKHOR (izquierda) - Clickeable a home
 * - Símbolo griego Ἰχώρ (debajo del logo)
 * - Carrito (derecha) - Con contador de items
 * - Usuario (derecha) - Acceso a cuenta
 * 
 * DISEÑO:
 * - Fondo: Blanco con blur
 * - Minimalista extremo
 * - Sin distracciones
 * 
 * PSICOLOGÍA:
 * - Limpio = Premium (todos los estratos)
 * - Contador rojo = Urgencia
 * ════════════════════════════════════════════════════════════
 */

interface NavbarProps {
  onOpenCart: () => void;
  cartCount: number;
}

export default function Navbar({ onOpenCart, cartCount }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-0 right-0 z-[50] px-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-xl border border-glassBorder rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        
        {/* Logo ÍKHOR - Izquierda */}
        <Link href="/" className="flex flex-col group">
          {/* Nombre principal */}
          <span className="text-xl tracking-[0.3em] font-serif font-bold text-text uppercase">
            ÍKHOR
          </span>
          {/* Símbolo griego */}
          <span className="text-[10px] tracking-[0.5em] text-muted uppercase -mt-1">
            Ἰχώρ
          </span>
        </Link>

        {/* Botones de Acción - Derecha */}
        <div className="flex items-center gap-3">
          
          {/* Botón del Carrito */}
          <motion.button
            onClick={onOpenCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-text/60 hover:text-text transition-colors group"
          >
            <ShoppingBag className="h-5 w-5" />
            
            {/* Contador de Items - Solo visible si hay productos */}
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          {/* Botón de Mi Cuenta */}
          <motion.button
            onClick={() => window.location.href = "/account"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-bg transition-all group"
            title="Mi Cuenta"
          >
            <User className="h-5 w-5 text-text/60 group-hover:text-text transition-colors" />
          </motion.button>
          
        </div>
      </div>
    </motion.nav>
  );
}
