"use client";
import { motion } from "framer-motion";
import { ShoppingBag, User, Sparkles } from "lucide-react";
import Link from "next/link";

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
      <div className="glass-panel mx-auto max-w-6xl flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-8 w-8 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-all">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <span className="text-sm tracking-[0.3em] font-serif font-bold text-white uppercase">
            AURA REBORN
          </span>
        </Link>

        {/* Action Buttons - Separados con flex gap */}
        <div className="flex items-center gap-3">
          {/* Botón del Carrito */}
          <motion.button
            onClick={onOpenCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-muted hover:text-accent transition-colors group"
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-[10px] text-bg rounded-full flex items-center justify-center font-black shadow-[0_0_15px_rgba(212,175,55,0.8)]"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          {/* Botón de Mi Cuenta - SEPARADO */}
          <motion.button
            onClick={() => window.location.href = "/account"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-white/5 transition-all relative group"
            title="Mi Cuenta"
          >
            <User className="h-5 w-5 text-white group-hover:text-accent transition-colors" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}