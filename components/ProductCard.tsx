"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import type { Perfume } from "@/lib/types";

interface ProductCardProps {
  perfume: Perfume;
  onClick?: () => void;
}

export default function ProductCard({ perfume, onClick }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null); // null = cargando
  const [loading, setLoading] = useState(false);

  // Cargar estado INMEDIATAMENTE sin retraso visual
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const result = await isInWishlist(perfume.id);
        setIsFavorited(result);
      } catch (error) {
        setIsFavorited(false); // Por defecto, no favorito si hay error
      }
    };
    checkWishlist();
  }, [perfume.id]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer relative overflow-hidden rounded-[40px] bg-white/[0.03] border border-glassBorder p-8 transition-all hover:bg-white/[0.06] hover:border-accent/50"
    >
      {/* Imagen del Perfume */}
      <div className="relative h-64 mb-8 bg-white/5 rounded-2xl overflow-hidden border border-glassBorder">
        {perfume.image_url ? (
          <img 
            src={perfume.image_url} 
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            Sin imagen
          </div>
        )}
        
        {/* Botón Corazón - SIN PARPADEO */}
        <button
          onClick={handleWishlist}
          disabled={loading || isFavorited === null} // Deshabilitado mientras carga
          className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/60 border border-white/20 hover:bg-accent hover:border-accent transition-all duration-300 disabled:opacity-50"
          title={isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-300 ${
              isFavorited === true
                ? "fill-red-500 text-red-500"
                : isFavorited === false
                ? "text-white/60 group-hover:text-white"
                : "text-white/30 animate-pulse" // Estado de carga: pulsante suave
            }`}
          />
        </button>
      </div>

      {/* Información */}
      <div className="space-y-4">
        <h3 className="text-white font-serif text-lg tracking-tight group-hover:text-accent transition-colors">
          {perfume.name}
        </h3>
        
        <p className="text-muted text-[10px] tracking-widest uppercase leading-relaxed line-clamp-2">
          {perfume.description || "Aura de lujo"}
        </p>

        <div className="flex justify-between items-end pt-4 border-t border-glassBorder/50">
          <span className="text-accent font-black text-xl">
            ${(perfume.price_cents / 100).toFixed(2)}
          </span>
          <span className="text-muted text-[9px] uppercase tracking-widest">
            {perfume.ml}ml
          </span>
        </div>
      </div>

      {/* Efecto Shine en Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </div>
  );
}
