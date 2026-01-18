"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, Droplets } from "lucide-react";
import type { Perfume } from "@/lib/types";
import CheckoutForm from "./CheckoutForm";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Perfume[];
  onRemove: (index: number) => void;
  onRemoveMultiple: (indices: number[]) => void;
  onAdd: (perfume: Perfume) => void;
  onComplete: () => void;
}

interface GroupedItem {
  perfume: Perfume;
  quantity: number;
  indices: number[];
}

export default function CartDrawer({ isOpen, onClose, cartItems, onRemove, onRemoveMultiple, onAdd, onComplete }: CartProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setShowCheckout(false), 500);
    }
  }, [isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-bg/80 backdrop-blur-md z-[200]" 
          />
          
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[rgba(10,10,10,0.95)] border-l border-glassBorder backdrop-blur-3xl z-[210] p-10 flex flex-col shadow-[-20px_0_80px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-glassBorder/50">
              <div className="flex items-center gap-4">
                <motion.div 
                  animate={{ rotate: showCheckout ? 360 : 0 }} 
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingBag className="h-5 w-5 text-accent" />
                </motion.div>
                <h2 className="text-2xl font-serif text-white tracking-[0.2em] uppercase">
                  {showCheckout ? "Checkout Seguro" : "El Ritual"}
                </h2>
              </div>
              
              <motion.button 
                onClick={() => { 
                  setShowCheckout(false); 
                  onClose(); 
                }} 
                whileHover={{ rotate: 90 }} 
                transition={{ duration: 0.3 }} 
                className="p-2 text-muted hover:text-white transition-colors"
              >
                <X />
              </motion.button>
            </div>
            {/* Continúa desde PARTE 1... */}

            {/* Área de Contenido */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {showCheckout ? (
                <CheckoutForm 
  onComplete={onComplete} 
  totalCents={totalCents} 
  cartItems={cartItems}
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
                          transition={{ 
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            mass: 0.5
                          }}
                          className="flex gap-4 p-5 rounded-[24px] bg-white/[0.02] border border-glassBorder group hover:bg-white/[0.04] hover:border-accent/30 transition-all duration-300"
                        >
                          {/* Imagen del Perfume */}
                          <div className="h-20 w-20 bg-white/5 rounded-xl overflow-hidden border border-glassBorder flex-shrink-0 relative group-hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-shadow duration-300">
                            {group.perfume.image_url ? (
                              <img 
                                src={group.perfume.image_url} 
                                alt={group.perfume.name}
                                className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-accent/5">
                                <Droplets className="h-8 w-8 text-accent/20" />
                              </div>
                            )}
                          </div>

                          {/* Información y Controles */}
                          <div className="flex-1 flex flex-col justify-between">
                            {/* Nombre y Precio */}
                            <div>
                              <h4 className="text-white font-serif text-base mb-1 tracking-tight leading-tight group-hover:text-accent transition-colors duration-300">
                                {group.perfume.name}
                              </h4>
                              <p className="text-accent font-bold text-sm tracking-tighter">
                                ${(group.perfume.price_cents / 100).toFixed(2)}
                              </p>
                            </div>
                            
                            {/* Controles de Cantidad */}
                            <div className="flex items-center gap-3 mt-3">
                              <motion.button 
                                onClick={() => handleDecrement(group)}
                                whileHover={{ 
                                  scale: 1.15, 
                                  backgroundColor: "rgba(239, 68, 68, 0.15)" 
                                }}
                                whileTap={{ scale: 0.85, rotate: -15 }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 600, 
                                  damping: 15 
                                }}
                                className="h-8 w-8 rounded-full border border-glassBorder flex items-center justify-center text-white hover:border-red-500/50 hover:text-red-400 transition-colors duration-150"
                              >
                                <Minus className="h-4 w-4" />
                              </motion.button>
                              
                              <motion.span 
                                key={`${group.perfume.id}-${group.quantity}`}
                                initial={{ scale: 1.5, y: -10, color: "#d4af37" }}
                                animate={{ scale: 1, y: 0, color: "#ffffff" }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 400, 
                                  damping: 18 
                                }}
                                className="text-white font-black text-base w-8 text-center"
                              >
                                {group.quantity}
                              </motion.span>
                              
                              <motion.button 
                                onClick={() => handleIncrement(group)}
                                whileHover={{ 
                                  scale: 1.15, 
                                  backgroundColor: "rgba(212, 175, 55, 0.2)",
                                  boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)"
                                }}
                                whileTap={{ scale: 0.85, rotate: 15 }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 600, 
                                  damping: 15 
                                }}
                                className="h-8 w-8 rounded-full border border-glassBorder flex items-center justify-center text-white hover:border-accent hover:text-accent transition-all duration-150"
                              >
                                <Plus className="h-4 w-4" />
                              </motion.button>
                            </div>

                            {/* Subtotal Animado */}
                            <motion.p 
                              key={`subtotal-${group.perfume.id}-${group.quantity}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-white/60 text-xs mt-2 tracking-wide"
                            >
                              Subtotal: <span className="text-accent font-bold">${((group.perfume.price_cents * group.quantity) / 100).toFixed(2)}</span>
                            </motion.p>
                          </div>
                          {/* Continúa desde PARTE 2... */}

                          {/* Botón Eliminar TODO */}
                          <motion.button 
                            onClick={() => handleRemoveAll(group)} 
                            disabled={isDeleting || removingId === group.perfume.id}
                            whileHover={{ scale: 1.25, rotate: 15 }}
                            whileTap={{ scale: 0.85, rotate: -15 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 500, 
                              damping: 15 
                            }}
                            className="p-3 text-muted hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
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
                        className="h-full py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-30"
                      >
                        <ShoppingBag className="h-20 w-20 text-accent/5" />
                        <p className="text-[10px] tracking-[0.6em] uppercase">
                          Tu ritual de compra está vacío
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer con Total y Botón Checkout */}
            {!showCheckout && groupedItems.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pt-10 border-t border-glassBorder/50 mt-auto"
              >
                <div className="flex justify-between items-end mb-10">
                  <div className="space-y-1">
                    <p className="text-muted uppercase text-[9px] tracking-[0.5em]">
                      Total Estimado
                    </p>
                    <motion.p 
                      key={cartItems.length}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white/40 text-[10px]"
                    >
                      Envío nacional incluido • {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </motion.p>
                  </div>
                  
                  <motion.span 
                    key={totalDollars}
                    initial={{ scale: 1.2, color: "#d4af37" }}
                    animate={{ scale: 1, color: "#d4af37" }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }}
                    className="text-4xl font-serif text-accent drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  >
                    ${totalDollars}
                  </motion.span>
                </div>
                {/* Continúa desde PARTE 3... */}
                
                <motion.button 
                  whileHover={{ 
                    scale: 1.02, 
                    backgroundColor: "#e5bc4b", 
                    boxShadow: "0 40px 80px rgba(212,175,55,0.35)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCheckout(true)} 
                  className="w-full bg-accent text-bg font-black py-6 rounded-full text-[11px] tracking-[0.5em] uppercase shadow-[0_30px_60px_rgba(212,175,55,0.2)] transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">Continuar al Checkout</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
