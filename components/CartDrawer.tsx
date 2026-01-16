"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Droplets } from "lucide-react";
import type { Perfume } from "@/lib/types";
import CheckoutForm from "./CheckoutForm";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Perfume[];
  onRemove: (index: number) => void;
  onComplete: () => void;
}

export default function CartDrawer({ isOpen, onClose, cartItems, onRemove, onComplete }: CartProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Resetear el estado del checkout cada vez que se cierra el carrito
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setShowCheckout(false), 500);
    }
  }, [isOpen]);

  // Cálculo preciso del total en céntimos y dólares
  const totalCents = cartItems.reduce((acc, item) => acc + item.price_cents, 0);
  const totalDollars = (totalCents / 100).toFixed(2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro con desenfoque */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-bg/80 backdrop-blur-md z-[200]" 
          />

          {/* Panel Lateral */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[rgba(10,10,10,0.95)] border-l border-glassBorder backdrop-blur-3xl z-[210] p-10 flex flex-col shadow-[-20px_0_80px_rgba(0,0,0,0.9)]"
          >
            {/* Cabecera dinámica */}
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-glassBorder/50">
              <div className="flex items-center gap-4">
                <ShoppingBag className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-serif text-white tracking-[0.2em] uppercase">
                  {showCheckout ? "Checkout" : "El Ritual"}
                </h2>
              </div>
              <button 
                onClick={() => { setShowCheckout(false); onClose(); }} 
                className="p-2 text-muted hover:text-white transition-colors"
              >
                <X />
              </button>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {showCheckout ? (
                /* 1. Formulario de Pago */
                <CheckoutForm 
                  onComplete={onComplete} 
                  totalCents={totalCents} 
                />
              ) : (
                /* 2. Lista de Productos */
                <div className="space-y-6">
                  {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <motion.div 
                        layout 
                        key={`${item.id}-${index}`} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="flex gap-6 p-5 rounded-[24px] bg-white/[0.02] border border-glassBorder group hover:bg-white/[0.04] transition-all"
                      >
                        <div className="h-20 w-20 bg-white/5 rounded-xl overflow-hidden border border-glassBorder flex-shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} className="h-full w-full object-cover opacity-80" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-accent/5"><Droplets className="text-accent/20" /></div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-white font-serif text-base mb-1 tracking-tight">{item.name}</h4>
                          <p className="text-accent font-bold text-sm tracking-tighter">${(item.price_cents / 100).toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => onRemove(index)} 
                          className="p-3 text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-30">
                      <ShoppingBag className="h-20 w-20 text-accent/5" />
                      <p className="text-[10px] tracking-[0.6em] uppercase">Tu ritual de compra está vacío</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pie de Carrito (Solo se muestra en la lista, no en el checkout) */}
            {!showCheckout && cartItems.length > 0 && (
              <div className="pt-10 border-t border-glassBorder/50 mt-auto animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-end mb-10">
                  <div className="space-y-1">
                    <p className="text-muted uppercase text-[9px] tracking-[0.5em]">Total Estimado</p>
                    <p className="text-white/40 text-[10px]">Envío nacional incluido</p>
                  </div>
                  <span className="text-4xl font-serif text-accent drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                    ${totalDollars}
                  </span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "#e5bc4b" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCheckout(true)} 
                  className="w-full bg-accent text-bg font-black py-6 rounded-full text-[11px] tracking-[0.5em] uppercase shadow-[0_30px_60px_rgba(212,175,55,0.2)] transition-all"
                >
                  Continuar al Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
