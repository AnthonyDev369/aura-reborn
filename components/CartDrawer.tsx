"use client";

/**
 * ════════════════════════════════════════════════════════════
 * CART DRAWER - ÍKHOR (Ἰχώρ) 40/40
 * ════════════════════════════════════════════════════════════
 * 
 * Carrito lateral deslizante PREMIUM
 * 
 * FUNCIONALIDADES:
 * - Añadir/quitar productos con controles +/-
 * - Eliminar producto completo (basura)
 * - Agrupación inteligente (mismo perfume = cantidad)
 * - Checkout integrado multi-pago
 * - Cálculo de total en tiempo real
 * - Animaciones fluidas y satisfactorias
 * 
 * DISEÑO 40/40:
 * - Fondo blanco marfil
 * - Ancho espacioso (max-w-xl = 576px)
 * - Padding generoso
 * - Colores platino
 * - Minimalista obsesivo
 * - Tipografía espaciada
 * 
 * PSICOLOGÍA:
 * - Ricos: Limpio como Apple Store, espacioso (10/10)
 * - Clase media: Profesional, fácil de leer (10/10)
 * - Clase baja: Claro, sin confusión (10/10)
 * - Minimalismo: Perfección técnica (10/10)
 * ════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, Droplets } from "lucide-react";
import type { Perfume } from "@/lib/types";
import CheckoutForm from "./CheckoutForm";

// ─────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Perfume[];
  onRemove: (index: number) => void;
  onRemoveMultiple: (indices: number[]) => void;
  onAdd: (perfume: Perfume) => void;
  importSettings: any;
  onComplete: () => void;
}

interface GroupedItem {
  perfume: Perfume;
  quantity: number;
  indices: number[];
}

export default function CartDrawer({ isOpen, onClose, cartItems, onRemove, onRemoveMultiple, onAdd, importSettings, onComplete }: CartProps) {
  
  // ─────────────────────────────────────────────────────────
  // ESTADOS
  // ─────────────────────────────────────────────────────────
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─────────────────────────────────────────────────────────
  // EFFECT: Resetear checkout al cerrar
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setShowCheckout(false), 500);
    }
  }, [isOpen]);

  // ─────────────────────────────────────────────────────────
  // LÓGICA: Agrupar items por ID
  // ─────────────────────────────────────────────────────────
  const groupedItems: GroupedItem[] = cartItems.reduce((acc, item, index) => {
    const existing = acc.find(g => g.perfume.id === item.id);
    if (existing) {
      existing.quantity++;
      existing.indices.push(index);
    } else {
      acc.push({ perfume: item, quantity: 1, indices: [index] });
    }
    return acc;
  }, [] as GroupedItem[]);

  const totalCents = cartItems.reduce((acc, item) => acc + item.price_cents, 0);
  const totalDollars = (totalCents / 100).toFixed(2);

  // ─────────────────────────────────────────────────────────
  // FUNCIONES DE CONTROL
  // ─────────────────────────────────────────────────────────
  
  const handleIncrement = (groupedItem: GroupedItem) => {
    onAdd(groupedItem.perfume);
  };

  const handleDecrement = (groupedItem: GroupedItem) => {
    if (groupedItem.indices.length > 0) {
      onRemove(groupedItem.indices[0]);
    }
  };

  const handleRemoveAll = (groupedItem: GroupedItem) => {
    if (isDeleting) return;
    setIsDeleting(true);
    setRemovingId(groupedItem.perfume.id);
    setTimeout(() => {
      onRemoveMultiple(groupedItem.indices);
      setRemovingId(null);
      setIsDeleting(false);
    }, 200);
  };
  // ─────────────────────────────────────────────────────────
  // RENDER: Interfaz del Carrito
  // ─────────────────────────────────────────────────────────
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro translúcido */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-text/40 backdrop-blur-sm z-[200]" 
          />
          
          {/* Panel Lateral - MÁS ANCHO (max-w-xl) */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white border-l border-glassBorder z-[210] p-10 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.15)]"
          >
            
            {/* ════════════════════════════════════════════ */}
            {/* HEADER - MÁS ESPACIOSO                       */}
            {/* ════════════════════════════════════════════ */}
            <div className="flex items-center justify-between mb-12 pb-8 border-b border-glassBorder">
              
              <div className="flex items-center gap-5">
                <motion.div 
                  animate={{ rotate: showCheckout ? 360 : 0 }} 
                  transition={{ duration: 0.5 }}
                  className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center"
                >
                  <ShoppingBag className="h-6 w-6 text-accent" />
                </motion.div>
                
                <div>
                  <h2 className="text-2xl font-serif text-text tracking-tight mb-1">
                    {showCheckout ? "Checkout" : "Carrito"}
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
                    {showCheckout ? "Paso final" : `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`}
                  </p>
                </div>
              </div>
              
              <motion.button 
                onClick={() => { 
                  setShowCheckout(false); 
                  onClose(); 
                }} 
                whileHover={{ rotate: 90 }} 
                transition={{ duration: 0.3 }} 
                className="p-3 text-muted hover:text-text transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
            {/* ════════════════════════════════════════════ */}
            {/* ÁREA DE CONTENIDO - MÁS ESPACIOSA           */}
            {/* ════════════════════════════════════════════ */}
            <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
              
              {showCheckout ? (
                <CheckoutForm 
                  onComplete={onComplete} 
                  totalCents={totalCents} 
                  cartItems={cartItems} 
                  importSettings={importSettings} 
                />
              ) : (
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {groupedItems.length > 0 ? (
                      groupedItems.map((group) => (
                        <motion.div 
                          layout
                          key={group.perfume.id} 
                          initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                          animate={{ 
                            opacity: removingId === group.perfume.id ? 0 : 1, 
                            y: 0,
                            scale: removingId === group.perfume.id ? 0.85 : 1,
                            x: removingId === group.perfume.id ? 120 : 0
                          }}
                          exit={{ opacity: 0, scale: 0.8, x: 150 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                          className="flex gap-5 p-5 rounded-2xl bg-bg border border-glassBorder group hover:border-accent transition-all duration-300"
                        >
                          {/* Imagen - MÁS GRANDE */}
                          <div className="h-24 w-24 bg-white rounded-xl overflow-hidden border border-glassBorder flex-shrink-0">
                            {group.perfume.image_url ? (
                              <img 
                                src={group.perfume.image_url} 
                                alt={group.perfume.name}
                                className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-bg">
                                <Droplets className="h-10 w-10 text-accent/30" />
                              </div>
                            )}
                          </div>

                          {/* Info - MÁS ESPACIO */}
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h4 className="text-text font-serif text-lg mb-2 tracking-tight leading-tight group-hover:text-accent transition-colors duration-300">
                                {group.perfume.name}
                              </h4>
                              <p className="text-muted text-base font-medium">
                                ${(group.perfume.price_cents / 100).toFixed(2)}
                              </p>
                            </div>
                            
                            {/* Controles - MÁS GRANDES */}
                            <div className="flex items-center gap-4 mt-4">
                              <motion.button 
                                onClick={() => handleDecrement(group)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 600, damping: 15 }}
                                className="h-9 w-9 rounded-full border-2 border-glassBorder flex items-center justify-center text-text hover:border-accent hover:bg-bg transition-all duration-150"
                              >
                                <Minus className="h-4 w-4" />
                              </motion.button>
                              
                              <motion.span 
                                key={`${group.perfume.id}-${group.quantity}`}
                                initial={{ scale: 1.3, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                className="text-text font-bold text-lg w-10 text-center"
                              >
                                {group.quantity}
                              </motion.span>
                              
                              <motion.button 
                                onClick={() => handleIncrement(group)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 600, damping: 15 }}
                                className="h-9 w-9 rounded-full border-2 border-glassBorder flex items-center justify-center text-text hover:border-accent hover:bg-accent hover:text-white transition-all duration-150"
                              >
                                <Plus className="h-4 w-4" />
                              </motion.button>
                            </div>

                            {/* Subtotal - Sutil */}
                            <motion.p 
                              key={`subtotal-${group.perfume.id}-${group.quantity}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="text-muted/60 text-xs mt-3 tracking-wide"
                            >
                              Subtotal: <span className="text-text/70 font-medium">${((group.perfume.price_cents * group.quantity) / 100).toFixed(2)}</span>
                            </motion.p>
                          </div>

                          {/* Botón Eliminar */}
                          <motion.button 
                            onClick={() => handleRemoveAll(group)} 
                            disabled={isDeleting || removingId === group.perfume.id}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            className="p-3 text-muted hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-full disabled:opacity-30 disabled:cursor-not-allowed self-start"
                            title={`Eliminar todo (${group.quantity})`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full py-40 flex flex-col items-center justify-center text-center space-y-8"
                      >
                        <ShoppingBag className="h-24 w-24 text-accent/20" />
                        <p className="text-xs tracking-[0.5em] uppercase text-muted">
                          Tu carrito está vacío
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {/* ════════════════════════════════════════════ */}
            {/* FOOTER - TOTAL Y BOTÓN (MÁS ESPACIOSO)      */}
            {/* ════════════════════════════════════════════ */}
            {!showCheckout && groupedItems.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pt-10 border-t border-glassBorder mt-auto"
              >
                {/* Barra decorativa */}
                <div className="h-1 w-14 bg-accent/30 rounded-full mb-8" />
                
                {/* Total - MÁS ESPACIOSO */}
                <div className="flex justify-between items-end mb-10">
                  <div className="space-y-2">
                    <p className="text-muted uppercase text-[10px] tracking-[0.4em] font-bold">
                      Total
                    </p>
                    <p className="text-muted text-xs">
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  
                  <motion.span 
                    key={totalDollars}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-5xl font-sans font-bold text-text tracking-tight tabular-nums"
                  >
                    ${totalDollars}
                  </motion.span>
                </div>
                
                {/* Botón Checkout - MÁS GRANDE */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCheckout(true)} 
                  className="w-full bg-text text-white font-bold py-6 rounded-full text-sm tracking-[0.4em] uppercase shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_50px_rgba(0,0,0,0.2)] transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">Continuar al Pago</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
                
                {/* Info de envío */}
                <p className="text-center text-muted text-[10px] uppercase tracking-widest mt-5">
                  Envío nacional incluido
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
