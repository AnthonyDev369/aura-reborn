"use client";

/**
 * ════════════════════════════════════════════════════════════
 * PRODUCT CARD - ÍKHOR (Ἰχώρ)
 * ════════════════════════════════════════════════════════════
 * 
 * Tarjeta de producto con SISTEMA DE PRE-ORDEN AUTOMÁTICO
 * 
 * FUNCIONALIDADES INNOVADORAS:
 * ✅ Detección automática de stock
 * ✅ Stock > 0: "COMPRAR AHORA" + Badge rojo si bajo
 * ✅ Stock = 0: "PRE-ORDENAR" + Días estimados de llegada
 * ✅ Cálculo automático: lead_time_days del proveedor
 * ✅ Sistema de favoritos integrado
 * 
 * PSICOLOGÍA:
 * - Stock bajo (<5): Urgencia visual (rojo)
 * - Stock = 0: Exclusividad (pre-orden azul)
 * - NUNCA pierdes una venta
 * 
 * DIFERENCIADOR:
 * - NINGUNA tienda en Ecuador/LatAm hace pre-orden automática
 * - Transparencia total (cliente sabe cuándo llega)
 * ════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from "react";
import { Heart, Clock, Package, Zap } from "lucide-react";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import type { Perfume } from "@/lib/types";

interface ProductCardProps {
  perfume: Perfume;
  onClick?: () => void;
}

export default function ProductCard({ perfume, onClick }: ProductCardProps) {
  
  // ─────────────────────────────────────────────────────────
  // ESTADOS
  // ─────────────────────────────────────────────────────────
  
  // Estado de favoritos
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────────────────
  // EFFECT: Cargar estado de favorito al montar
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    isInWishlist(perfume.id)
      .then(setIsFavorited)
      .catch(() => setIsFavorited(false));
  }, [perfume.id]);

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Manejar favoritos
  // ─────────────────────────────────────────────────────────
  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation(); // No abrir modal
    setLoading(true);
    try {
      const result = await toggleWishlist(perfume.id);
      setIsFavorited(result);
    } catch (error: any) {
      alert(error.message || "Inicia sesión para guardar favoritos");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // LÓGICA DE STOCK Y PRE-ORDEN (INNOVADORA)
  // ─────────────────────────────────────────────────────────
  
  const stock = perfume.stock || 0;
  const leadTimeDays = perfume.lead_time_days || 14;
  const canPreorder = perfume.is_preorder_enabled !== false;
  
  // Estados del producto
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isOutOfStock = stock === 0;
  const showPreorder = isOutOfStock && canPreorder;
  
  // Estimado en DÍAS (más honesto que fecha exacta)
const estimatedDaysMin = leadTimeDays;
const estimatedDaysMax = leadTimeDays + 3; // Rango de seguridad
const daysText = `${estimatedDaysMin}-${estimatedDaysMax} días`;
  // ─────────────────────────────────────────────────────────
  // RENDER: Tarjeta de Producto
  // ─────────────────────────────────────────────────────────
  
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer relative overflow-hidden rounded-3xl bg-white border border-glassBorder p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-accent"
    >
      
      {/* ════════════════════════════════════════════ */}
      {/* IMAGEN DEL PERFUME                           */}
      {/* ════════════════════════════════════════════ */}
      <div className="relative h-72 mb-6 bg-bg rounded-2xl overflow-hidden">
        {perfume.image_url ? (
          <img 
            src={perfume.image_url} 
            alt={perfume.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted/20">
            <Package className="h-16 w-16" />
          </div>
        )}
        
        {/* ──────────────────────────────────────── */}
        {/* BOTÓN CORAZÓN - Favoritos                */}
        {/* ──────────────────────────────────────── */}
        <button
          onClick={handleWishlist}
          disabled={loading || isFavorited === null}
          className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/90 backdrop-blur-sm border border-glassBorder hover:bg-accent hover:border-accent transition-all duration-300 disabled:opacity-50"
          title={isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              isFavorited === true
                ? "fill-red-500 text-red-500"
                : isFavorited === false
                ? "text-text/60"
                : "text-text/30 animate-pulse"
            }`}
          />
        </button>

        {/* ──────────────────────────────────────── */}
        {/* BADGE DE STOCK BAJO (Solo 3 disponibles) */}
        {/* ──────────────────────────────────────── */}
        {isLowStock && (
          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-red-50 border border-red-200 backdrop-blur-sm">
            <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-3 w-3" />
              Solo {stock} disponibles
            </p>
          </div>
        )}

        {/* ──────────────────────────────────────── */}
        {/* BADGE DE PRE-ORDEN (INNOVADOR)           */}
        {/* ──────────────────────────────────────── */}
        {showPreorder && (
          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 backdrop-blur-sm">
            <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-3 w-3 animate-pulse" />
              Pre-orden • Llega en {daysText}
            </p>
          </div>
        )}
        
        {/* Badge de disponibilidad inmediata */}
        {isInStock && !isLowStock && (
          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-green-50 border border-green-200 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-green-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
              <Package className="h-3 w-3" />
              Disponible
            </p>
          </div>
        )}
      </div>
      {/* ════════════════════════════════════════════ */}
      {/* INFORMACIÓN DEL PRODUCTO                     */}
      {/* ════════════════════════════════════════════ */}
      <div className="space-y-3">
        
        {/* Nombre del Perfume */}
        <h3 className="text-text font-serif text-xl tracking-tight group-hover:text-accent transition-colors">
          {perfume.name}
        </h3>
        
        {/* Descripción */}
        <p className="text-muted text-xs tracking-wide uppercase leading-relaxed line-clamp-2">
          {perfume.description || "Fragancia de lujo"}
        </p>

        {/* Precio y Volumen */}
        <div className="flex justify-between items-end pt-4 border-t border-glassBorder">
          <span className="text-accent font-bold text-2xl tabular-nums">
            ${(perfume.price_cents / 100).toFixed(2)}
          </span>
          <span className="text-muted text-[10px] uppercase tracking-widest">
            {perfume.ml}ml
          </span>
        </div>
        
        {/* ──────────────────────────────────────── */}
        {/* INDICADOR DE DISPONIBILIDAD (Hover)      */}
        {/* ──────────────────────────────────────── */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-3">
          {isInStock ? (
            <p className="text-text text-[9px] uppercase tracking-widest font-bold">
              ⚡ Envío inmediato
            </p>
          ) : showPreorder ? (
            <p className="text-blue-600 text-[9px] uppercase tracking-widest font-bold">
              📦 Pre-orden disponible
            </p>
          ) : (
            <p className="text-muted text-[9px] uppercase tracking-widest">
              Agotado
            </p>
          )}
        </div>
      </div>
      
      {/* Efecto de brillo al pasar el mouse */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </div>
  );
}
