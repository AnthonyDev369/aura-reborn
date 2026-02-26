"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Droplets, X, ShoppingBag } from "lucide-react";
import type { Perfume, PerfumeVariant, ImportSettings } from "@/lib/types";

interface ProductModalProps {
  selectedPerfume: Perfume | null;
  onClose: () => void;
  perfumeVariants: PerfumeVariant[];
  selectedVariantId: string | null;
  setSelectedVariantId: (id: string | null) => void;
  importSettings: ImportSettings | null;
  onAddToCart: (perfume: Perfume) => void;
}

export default function ProductModal({
  selectedPerfume,
  onClose,
  perfumeVariants,
  selectedVariantId,
  setSelectedVariantId,
  importSettings,
  onAddToCart,
}: ProductModalProps) {
  return (
    <AnimatePresence>
      {selectedPerfume && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6"
        >
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-text/60 backdrop-blur-2xl" 
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, y: 40 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0 }} 
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-5xl bg-white border border-glassBorder rounded-[50px] overflow-hidden flex flex-col md:flex-row max-h-[90vh] shadow-[0_80px_200px_rgba(0,0,0,0.3)]"
          >
            {/* Botón Cerrar */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 md:top-8 md:right-8 p-3 rounded-full bg-bg border border-glassBorder text-text z-50 hover:bg-text hover:text-white transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* COLUMNA IZQUIERDA: Imagen */}
            <div className="w-full md:w-2/5 bg-bg flex items-center justify-center relative border-b md:border-b-0 md:border-r border-glassBorder p-12">
              {selectedPerfume.image_url ? (
                <img 
                  src={selectedPerfume.image_url} 
                  alt={selectedPerfume.name}
                  className="w-full h-full max-h-96 object-contain opacity-90" 
                />
              ) : (
                <Droplets className="h-32 w-32 text-accent/30" />
              )}
            </div>
            {/* COLUMNA DERECHA: Información y Variantes */}
            <div className="flex-1 p-8 md:p-12 flex flex-col overflow-y-auto">
              
              {/* Header con Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-10 bg-accent/30 rounded-full" />
                <span className="text-[10px] tracking-[0.4em] text-accent uppercase font-bold">
                  Edición Limitada
                </span>
              </div>
              
              {/* Nombre del Perfume */}
              <h2 className="text-4xl md:text-5xl font-serif text-text mb-3 tracking-tight leading-tight">
                {selectedPerfume.name}
              </h2>
              
              {/* Marca/Categoría */}
              <p className="text-muted text-sm uppercase tracking-widest mb-8">
                {selectedPerfume.concentration || 'Eau de Parfum'} • {selectedPerfume.category?.replace('arabe_medio', 'Arabe')
                        .replace('arabe_premium', 'Arabe Premium')
                        .replace('diseñador_premium', 'Diseñador')
                        .replace('diseñador_mainstream', 'Diseñador')
                        .replace('nicho_accesible', 'Nicho')
                        .replace('ultra_nicho', 'Nicho')
                        .replace('_', ' ')}

              </p>

              {/* SELECTOR DE TAMAÑOS */}
              {perfumeVariants.length > 0 && (
                <div className="mb-8">
                  <p className="text-text text-xs uppercase tracking-widest font-bold mb-4">
                    Selecciona Tamaño:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {perfumeVariants.map((variant) => {
                      const isSelected = selectedVariantId === variant.id;
                      const isAvailable = variant.stock > 0;
                      
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          disabled={!isAvailable && !variant.is_preorder_enabled}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? 'border-text bg-text/5'
                              : 'border-glassBorder hover:border-accent'
                          } ${!isAvailable ? 'opacity-60' : ''}`}
                        >
                          <p className="text-text font-bold text-sm mb-1">
                            {variant.size_ml}ml
                          </p>
                          <p className="text-text font-bold text-lg">
                            ${(variant.price_cents / 100).toFixed(2)}
                          </p>
                          <p className="text-muted text-[10px] uppercase tracking-widest mt-1">
                            {isAvailable 
                              ? `${variant.stock} en stock` 
                              : 'Pre-orden'}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Precio Principal (de la variante seleccionada) */}
              {(() => {
                const selectedVariant = perfumeVariants.find(v => v.id === selectedVariantId);
                const displayPrice = selectedVariant 
                  ? (selectedVariant.price_cents / 100).toFixed(2)
                  : (selectedPerfume.price_cents / 100).toFixed(2);
                
                return (
                  <div className="mb-8 pb-8 border-b border-glassBorder">
                    <p className="text-muted text-[10px] uppercase tracking-widest mb-2">
                      Precio
                    </p>
                    <p className="text-text font-bold text-4xl tabular-nums">
                      ${displayPrice}
                    </p>
                  </div>
                );
              })()}

              {/* SPECS TÉCNICAS Y NOTAS OLFATIVAS */}
              <div className="mb-8 space-y-6">
                <p className="text-text text-xs uppercase tracking-widest font-bold">
                  Especificaciones:
                </p>
                
                {/* Grid de Specs Básicas */}
                <div className="grid grid-cols-2 gap-4 text-sm pb-6 border-b border-glassBorder">
                  <div>
                    <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Concentración</p>
                    <p className="text-text font-medium">{selectedPerfume.concentration || 'Eau de Parfum'}</p>
                  </div>
                  <div>
                    <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Género</p>
                    <p className="text-text font-medium">Unisex</p>
                  </div>
                  {selectedPerfume.brand && (
                    <div>
                      <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Marca</p>
                      <p className="text-text font-medium">{selectedPerfume.brand}</p>
                    </div>
                  )}
                  {selectedPerfume.origin_country && (
                    <div>
                      <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Origen</p>
                      <p className="text-text font-medium">{selectedPerfume.origin_country}</p>
                    </div>
                  )}
                  {(() => {
                    const selectedVariant = perfumeVariants.find(v => v.id === selectedVariantId);
                    return selectedVariant?.stock !== undefined && (
                      <div className="col-span-2">
                        <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Disponibilidad</p>
                        <p className={`font-bold ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                          {selectedVariant.stock > 0 
                            ? `${selectedVariant.stock} unidades disponibles` 
                            : 'Pre-orden disponible'}
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* PIRÁMIDE OLFATIVA (si tiene notas) */}
                {(selectedPerfume.top_notes || selectedPerfume.heart_notes || selectedPerfume.base_notes) && (
                  <div className="space-y-4">
                    <p className="text-text text-xs uppercase tracking-widest font-bold">
                      Pirámide Olfativa:
                    </p>
                    
                    {selectedPerfume.top_notes && (
                      <div className="p-4 rounded-xl bg-bg border border-glassBorder">
                        <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Notas de Salida</p>
                        <p className="text-text text-sm">{selectedPerfume.top_notes}</p>
                      </div>
                    )}
                    
                    {selectedPerfume.heart_notes && (
                      <div className="p-4 rounded-xl bg-bg border border-glassBorder">
                        <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Notas de Corazón</p>
                        <p className="text-text text-sm">{selectedPerfume.heart_notes}</p>
                      </div>
                    )}
                    
                    {selectedPerfume.base_notes && (
                      <div className="p-4 rounded-xl bg-bg border border-glassBorder">
                        <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Notas de Fondo</p>
                        <p className="text-text text-sm">{selectedPerfume.base_notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Descripción */}
              <p className="text-muted text-sm leading-relaxed mb-8 italic">
                &quot;{selectedPerfume.description || "Una sinfonía olfativa diseñada para trascender."}&quot;
              </p>

              {/* Mensaje de Pre-orden (si la variante seleccionada está agotada) */}
              {(() => {
                const selectedVariant = perfumeVariants.find(v => v.id === selectedVariantId);
                const isOutOfStock = selectedVariant && selectedVariant.stock === 0;
                const canPreorder = selectedVariant?.is_preorder_enabled !== false;
                
                if (isOutOfStock && canPreorder) {
                  // Calcular días estimados
                  let estimatedDays = "20-25";
                  if (importSettings) {
                    const method = importSettings.active_method;
                    if (method === 'courier') {
                      const min = (importSettings.courier_supplier_days_min || 7) + 
                                  (importSettings.courier_shipping_days || 7) + 
                                  (importSettings.courier_warehouse_days_min || 3);
                      const max = (importSettings.courier_supplier_days_max || 9) + 
                                  (importSettings.courier_shipping_days || 7) + 
                                  (importSettings.courier_warehouse_days_max || 7);
                      estimatedDays = `${min}-${max}`;
                    } else {
                      const min = (importSettings.viajero_supplier_days_min || 7) + 
                                  (importSettings.viajero_shipping_days_min || 10) + 
                                  (importSettings.viajero_warehouse_days_min || 3);
                      const max = (importSettings.viajero_supplier_days_max || 9) + 
                                  (importSettings.viajero_shipping_days_max || 20) + 
                                  (importSettings.viajero_warehouse_days_max || 7);
                      estimatedDays = `${min}-${max}`;
                    }
                  }

                  return (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-2">
                        🕐 Pre-orden Disponible
                      </p>
                      <p className="text-blue-600 text-sm">
                        Este producto se pedirá al proveedor. <br />
                        Estimado de llegada: <span className="font-bold">{estimatedDays} días hábiles</span>
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Botón de Compra Dinámico */}
              {(() => {
                const selectedVariant = perfumeVariants.find(v => v.id === selectedVariantId);
                const isInStock = selectedVariant ? selectedVariant.stock > 0 : selectedPerfume.stock > 0;
                const canPreorder = selectedVariant?.is_preorder_enabled !== false;

                return (
                  <button 
                    onClick={() => onAddToCart(selectedPerfume)} 
                    disabled={!isInStock && !canPreorder}
                    className={`w-full font-bold py-5 md:py-6 rounded-full text-[11px] tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 group relative overflow-hidden ${
                      isInStock
                        ? 'bg-text text-white hover:bg-accent'
                        : canPreorder
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-muted/20 text-muted cursor-not-allowed'
                    }`}
                  >
                    <span className="relative z-10">
                      {isInStock ? 'AÑADIR AL CARRITO' : canPreorder ? 'PRE-ORDENAR' : 'AGOTADO'}
                    </span>
                    <ShoppingBag className="h-5 w-5 relative z-10" />
                    {(isInStock || canPreorder) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                  </button>
                );
              })()}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
